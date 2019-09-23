const express = require('express');

const slackController = require('../controllers/slackController');
const jwtController = require('../controllers/jwtController')
const sentimentController = require('../controllers/sentimentController');
const router = express.Router();

// Delivers sentiment data for specific channel to client
router.get('/', jwtController.verify, slackController.getHistory, sentimentController.parseData, (req, res) => {
  const { sentimentData } = res.locals;
  return res.status(200).json(sentimentData);
});

// Delivers list of channels to client
router.get('/channels', jwtController.verify, slackController.getChannels, (req, res) => {
  const { channels } = res.locals;
  return res.status(200).json(channels);
});

// Redirect URL from Slack after user approves our App with requested scopes
// For more information: https://api.slack.com/docs/oauth
router.get('/auth', slackController.oAuth, jwtController.create, (req, res) => {
  const { token } = res.locals;
  res.cookie('token', token, { httpOnly: true });
  return res.redirect('/');
});

module.exports = router;