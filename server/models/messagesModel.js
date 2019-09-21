const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const messagesSchema = new Schema({
  id: { type: String, required: true },
  authors: { type: String, required: true },
  msg: { type: String, required: true },
  workspace: { type: String, required: true },
  channel: { type: String, required: true },
  date: { type: Date, required: true }
});

//export model through module.exports
//collection name is messages
const Messages = mongoose.model('messages', messagesSchema);

module.exports = Messages;
