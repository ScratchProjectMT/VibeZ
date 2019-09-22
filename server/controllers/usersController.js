const Users = require('../models/usersModel');

const usersController = { };


/** 
 * @function getAllUsers fetch list all users
 */
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