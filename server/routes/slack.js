const express = require('express');
const slackController = require('../controllers/slackController');
const router = express.Router();

router.get('/', slackController.getHistory, (req, res) => {
  const { data } = res.locals
  res.status(200).json(data);
})


module.exports = router;