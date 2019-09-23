require('dotenv').config();
const express = require('express');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const path = require('path');

const slackRouter = require('./routes/slackRouter');
const app = express();
const PORT = 3000;

const defaultError = {
  log: 'Express error handler caught unknown middleware error',
  status: 400,
  message: { err: 'An error occurred' }, 
};

app.use(bodyParser.json())
app.use(cookieParser());

app.use('/slack', slackRouter)

app.get('/', (req, res) => {
  const index = path.resolve(__dirname, '../client/index.html');
  return res.sendFile(index);
});

app.all('*', (req, res) => {
  res.sendStatus(404);
});

function errorHandler(err, req, res, next) {
  const errorObj = { ...defaultError, ...err };
  console.error(errorObj.log);
  return res.json({
    status: errorObj.status,
    message: errorObj.message,
  });
};

app.use((err, req, res, next) => {
  return errorHandler(err, req, res, next);
});

app.listen(PORT, () => {
  console.log(`Listening on port ${PORT}`);
});
