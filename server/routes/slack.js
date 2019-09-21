const express = require('express');
const slackController = require('../controllers/slackController');
const sentimentController = require('../controllers/sentimentController');
const router = express.Router();

router.get('/', slackController.getHistory, sentimentController.parseData, (req, res) => {
  const { sentimentData } = res.locals;
  res.status(200).json(sentimentData);
});

// This route handles get request to a /oauth endpoint. We'll use this endpoint for handling the logic of the Slack oAuth process behind our app.
app.get('/oauth', slackController.oAuth, slackController.getUser, (req, res) => {
  const { oAuth } = res.locals;
  res.status(200).json(oAuth);
});


module.exports = router;
