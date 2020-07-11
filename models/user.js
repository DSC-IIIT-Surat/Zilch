var mongoose = require("mongoose"),
  passportLocalMongoose = require("passport-local-mongoose");

// User Schema

var UserSchema = new mongoose.Schema({
  username: String,
  email: String,
  password: String,
  friends: [],
  post: []
});
UserSchema.plugin(passportLocalMongoose);

var User = mongoose.model("User", UserSchema);

module.exports = User;
