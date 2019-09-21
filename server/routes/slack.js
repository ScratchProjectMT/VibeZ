const express = require('express');
const slackController = require('../controllers/slackController');
const sentimentController = require('../controllers/sentimentController');
const router = express.Router();

router.get('/', slackController.getHistory, sentimentController.parseData, (req, res) => {
  const { sentimentData } = res.locals;
  res.status(200).json(sentimentData);
})




module.exports = router;
