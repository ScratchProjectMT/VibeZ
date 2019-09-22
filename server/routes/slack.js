const express = require('express');
const path = require('path');

const slackController = require('../controllers/slackController');
const sentimentController = require('../controllers/sentimentController');
const router = express.Router();

router.get('/', slackController.getHistory, sentimentController.parseData, (req, res) => {
  const { sentimentData } = res.locals;
  return res.status(200).json(sentimentData);
});

router.get('/channels', slackController.getChannels, (req, res) => {
  const { channels } = res.locals;
  return res.status(200).json(channels);
});

// This route handles get request to a /oauth endpoint. We'll use this endpoint for handling the logic of the Slack oAuth process behind our app.
router.get('/auth', slackController.oAuth, (req, res) => {
  const { token } = res.locals;
  console.log(token);
  res.cookie('token', token, { httpOnly: true });
  const index = path.resolve(__dirname, '../../client/index.html');
  console.log(index);
  return res.redirect('/');
});

module.exports = router;
