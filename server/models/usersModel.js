const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const usersSchema = new Schema({
  name: {type: String, required: true},
  userId: { type: String, required: true },
  teamId: { type: String, required: true },
  accessToken: { type: String, required: true },
});

//export model through module.exports
//collection name is messages
const Users = mongoose.model('users', usersSchema);

module.exports = Users;
