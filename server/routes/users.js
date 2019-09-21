const express = require('express');
const usersController = require('../controllers/usersController');
const router = express.Router();

router.get('/', usersController.getAllUsers, (req, res) => {
  const { users } = res.locals;
  res.status(200).json({ users })
});

module.exports = router;
