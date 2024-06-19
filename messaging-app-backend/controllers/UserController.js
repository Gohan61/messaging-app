const User = require("../models/user");
const asyncHandler = require("express-async-handler");
const bcrypt = require("bcryptjs");
const { body, validationResult } = require("express-validator");

exports.signup = [
  body("first_name", "First name must be between 2 and 50 characters")
    .trim()
    .isLength({ min: 2, max: 50 })
    .escape(),
  body("last_name", "Last name must be between 2 and 50 characters")
    .trim()
    .isLength({ min: 2, max: 50 })
    .escape(),
  body("username", "Username must be between 5 and 20 characters")
    .trim()
    .isLength({ min: 5, max: 20 })
    .escape(),
  body("password", "Password must be between 5 and 80 characters")
    .trim()
    .isLength({ min: 5, max: 100 })
    .escape(),
  body("age", "Age must be a number").trim().isInt().escape(),
  body("bio", "Bio must be between one and 200 characters")
    .trim()
    .isLength({ min: 1, max: 200 })
    .escape(),

  asyncHandler(async (req, res, next) => {
    const errors = validationResult(req);

    try {
      bcrypt.hash(req.body.password, 10, async (err, hashedPassword) => {
        const user = new User({
          first_name: req.body.first_name,
          last_name: req.body.last_name,
          username: req.body.username,
          password: hashedPassword,
          age: req.body.age,
          bio: req.body.bio,
        });
        if (
          !errors.isEmpty() ||
          (await User.exists({ username: req.body.username }))
        ) {
          return res.status(500).json({ errors, user });
        } else if (err) {
          throw new Error("Error");
        } else {
          await user.save();
          return res.status(200).json({ message: "You are signed up" });
        }
      });
    } catch (err) {
      return next(err);
    }
  }),
];
