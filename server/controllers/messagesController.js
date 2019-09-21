const Messages = require('../models/messagesModel');

const messagesController = { };

messagesController.getAllMessages = async (req, res, next) => {
  try {
    const messages = await Messages.find({ }).exec();
    res.locals.messages = messages;
    next();
  } catch (err) {
    return next({ err: 'Server error while trying to get all messages.' });
  }
};

module.exports = messagesController;
