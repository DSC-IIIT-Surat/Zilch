const express = require("express");
const router = express.Router();
const User = require("./../models/user");
const passport = require("passport");
const cryptoRandomString = require("crypto-random-string");

router.get("/addFriend", (req, res) => {
	User.find({ username: req.user.username }, (err, fri) => {
		userArray = [];
		fri[0].friends.forEach((element) => {
			userArray.push(element.username);
		});

		userArray.push(req.user.username);
		console.log(userArray);

		User.find({ username: { $nin: userArray } }).limit(10).exec((err, data) => {
			if (err) {
				console.log(err);
			} else {
				res.render("add_friend", { data: data ,friends :userArray});
			}
		});
	});
});

router.post("/make_friend", (req, res) => {
	User.findOne({ username: req.body.username }, (err, data) => {
		if (err) {
			console.log(err);
		} else {
			console.log("current user : " + req.user.username); //Just for debugging
			console.log("new user : " + data.username); //Just for debugging

			//Random string for Room (used for sockets)
			const randomstring = cryptoRandomString({
				length: 10,
				type: "url-safe",
			});
			//This one changes current user's Array
			User.updateOne(
				{ username: req.user.username },
				{
					$push: {
						friends: {
							username: data.username,
							room: randomstring,
						},
					},
				},
				(err, r) => {
					if (err) {
						console.log(err);
					} else {
						console.log(r);
					}
				}
			);

			//This one change Friend's friend array
			//Same room to connect afterwards
			User.updateOne(
				{ username: data.username },
				{
					$push: {
						friends: {
							username: req.user.username,
							room: randomstring,
						},
					},
				},
				(err, r) => {
					if (err) {
						console.log(err);
					} else {
						console.log(r);
					}
				}
			);

			res.redirect("/addFriend");
		}
	});
});


router.get("/search", (req, res) => {
	var regex = new RegExp(req.query.word, 'i')
	User.find({ username: regex }).limit(15).exec((err, data) => {
		res.jsonp(data)
	})
})

module.exports = router;
