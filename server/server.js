require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const path = require('path');
const cors = require('cors');

const app = express();
const PORT = 3000;

//require routers
const users = require('./routes/users');
const slack = require('./routes/slack');

// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }))
// parse application/json
app.use(bodyParser.json())

//app.use(cors())

//connect to mongoose database
mongoose.connect('mongodb+srv://VibeZ:VibeZ@nodeproject-o98p0.mongodb.net/test?retryWrites=true&w=majority', { useNewUrlParser: true, useUnifiedTopology: true });
let db = mongoose.connection;
db.once('open', function(callback) {
  console.log('Connected to Mongoose');
});

//serve index.html
app.get('/', (req, res) => {
  const index = path.resolve(__dirname, '../client/index.html');
  res.sendFile(index);
 })

app.get('/auth', (req, res) => {
  res.redirect(`https://cors-anywhere.herokuapp.com/https://slack.com/oauth/authorize?client_id=653541339828.770604966199&scope=channels%3Ahistory+channels%3Aread`)
});
 //define route handlers
app.use('/users', users)
app.use('/slack', slack)

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
  res.json({
    status: errorObj.status,
    message: errorObj.message,
  });
}

app.use((err, req, res, next) => {
  errorHandler(err, req, res, next);
});

app.listen(PORT, () => {
  console.log('Connected to the server.')
})