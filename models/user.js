var mongoose               = require('mongoose'),
    passportLocalMongoose  = require('passport-local-mongoose');

// User Schema

var UserSchema = new mongoose.Schema({
    username: String,
    password: String,
    friends : []
});
UserSchema.plugin(passportLocalMongoose);


var User = mongoose.model("User", UserSchema);

module.exports = User;