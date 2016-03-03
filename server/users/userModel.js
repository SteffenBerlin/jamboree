var mongoose = require('mongoose');

var userSchema = new mongoose.Schema({
  fbId : String,
  token: String,
  name: String,
  picture: String,
  friends: []
});

module.exports = mongoose.model('User', userSchema);
