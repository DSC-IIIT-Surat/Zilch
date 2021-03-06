var express = require("express");
var router = express.Router();
var User = require("./../models/user");
var passport = require("passport");

//Auth routes
router.get("/signin", (req, res) => {
  res.render("signin");
});

router.post("/signin", (req, res) => {
  username = req.body.username;
  password = req.body.password;
  email1 = req.body.email;
  User.register(new User({ username: username,email : email1 }), password, (err, user) => {
    if (err) {
      console.log(err);
    } else {
      console.log(user);
    }
  });

  res.redirect("/login");
});

router.get("/login", (req, res) => {
  res.render("login");
});

router.post(
  "/login",
  passport.authenticate("local", {
    successRedirect: "/addFriend",
    failureRedirect: "/login",
  }),
  (req, res) => {}
);

module.exports = router;
