const User = require("../models/user");
const asyncHandler = require("express-async-handler");
const bcrypt = require("bcryptjs");
const { body, validationResult } = require("express-validator");
const passport = require("passport");
const jwt = require("jsonwebtoken");

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
  body("age", "Age must be a number").trim().isInt().optional().escape(),
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
        if (await User.exists({ username: req.body.username })) {
          return res
            .status(500)
            .json({ message: "Username already exists", user });
        } else if (!errors.isEmpty()) {
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

exports.signin = [
  body("username").trim().escape(),
  body("password").trim().escape(),

  asyncHandler(async (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      res.json({ message: "Validation Failed", errors: errors.array() });
      return;
    }
    passport.authenticate("local", { session: false }, (err, user, info) => {
      if (err) {
        return next(err);
      }
      if (!user) {
        res.status(500).json({ error: "User not found", user: user });
      } else {
        req.login(user, { session: false });
        jwt.sign(
          { user: user },
          process.env.secret,
          { expiresIn: "10d" },
          (err, token) => {
            if (err) console.log(err);

            res.status(200).json({
              token: token,
              userId: user._id,
              username: user.username,
            });
          },
        );
      }
    })(req, res, next);
  }),
];

exports.userlist = asyncHandler(async (req, res, next) => {
  const users = await User.find(
    {},
    "first_name last_name username age bio",
  ).exec();

  if (!users) {
    const err = { message: "No users found", status: 404 };
    return next(err);
  } else {
    return res.status(200).json({ users });
  }
});

exports.profile = asyncHandler(async (req, res, next) => {
  const user = await User.findById(
    req.params.userId,
    "first_name last_name username age bio",
  );

  if (!user) {
    const err = { message: "No user found", status: 404 };
    return next(err);
  } else {
    return res.status(200).json({ user });
  }
});

exports.update_profile = [
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
        if (await User.exists({ username: req.body.username })) {
          return res
            .status(500)
            .json({ message: "Username already exists", user });
        } else if (!errors.isEmpty()) {
          return res.status(500).json({ errors, user });
        } else if (err) {
          throw new Error("Error");
        } else {
          await user.save();
          return res.status(200).json({ message: "Your profile is updated" });
        }
      });
    } catch (err) {
      return next(err);
    }
  }),
];
