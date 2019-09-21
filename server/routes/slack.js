const express = require('express');
const slackController = require('../controllers/slackController');
const sentimentController = require('../controllers/sentimentController');
const router = express.Router();

router.get('/', slackController.getHistory, sentimentController.parseData, (req, res) => {
  const { sentimentData } = res.locals;
  res.status(200).json(sentimentData);
})

router.get('/channels', slackController.getChannels, (req, res) => {
  const { channels } = res.locals;
  res.status(200).json(channels)
})

// This route handles get request to a /oauth endpoint. We'll use this endpoint for handling the logic of the Slack oAuth process behind our app.
router.get('/auth', slackController.oAuth, (req, res) => {
  const { accessToken } = res.locals;
  console.log(accessToken);
  res.status(200).json();
});


module.exports = router;
