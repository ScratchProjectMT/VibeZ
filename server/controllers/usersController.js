const Users = require('../models/usersModel');

const usersController = { };

usersController.getAllUsers = async (req, res, next) => {
  try {
    const users = await Users.find({ }).exec();
    res.locals.users = users;
    next();
  } catch (err) {
    return next({ err: 'Server error while trying to get all users.' });
  }
};

module.exports = usersController;