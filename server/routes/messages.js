const express = require('express');
const messagesController = require('../controllers/messagesController');
const router = express.Router();

router.get('/', messagesController.getAllMessages, (req, res) => {
  console.log('inside messages router')
  const { messages } = res.locals;
  res.status(200).json({ messages })
});
// router.post('/', messagesController.createMessages, (req, res) => {});

module.exports = router;
