require('dotenv').config();
const express = require('express');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const path = require('path');

const app = express();
const slackController = require('./controllers/slackController');
const PORT = 3000;

//require routers
const users = require('./routes/users');
const slack = require('./routes/slack');

// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }))
// parse application/json
app.use(bodyParser.json())

app.use(cookieParser());

 //define route handlers
app.use('/users', users)
app.use('/slack', slack)

app.get('/login', (req, res) => {
  const login = path.resolve(__dirname, '../client/login.html');
  return res.sendFile(login);
});

//serve index.html
app.get('/', (req, res) => {
  const index = path.resolve(__dirname, '../client/index.html');
  return res.sendFile(index);
});

const defaultError = {
  log: 'Express error handler caught unknown middleware error',
  status: 400,
  message: { err: 'An error occurred' }, 
};

// catch-all route handler for any requests to an unknown route
app.all('*', (req, res) => {
  res.sendStatus(404);
});

//global error handler
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
