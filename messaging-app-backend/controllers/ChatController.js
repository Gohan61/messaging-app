const User = require("../models/user");
const Chat = require("../models/chats");
const asyncHandler = require("express-async-handler");
const bcrypt = require("bcryptjs");
const { body, validationResult } = require("express-validator");
const passport = require("passport");
const jwt = require("jsonwebtoken");

exports.new_chat = asyncHandler(async (req, res, next) => {
  const user = await User.findById(req.body.userId);
  const otherUser = await User.findById(req.body.otherUserId);

  if (!user) {
    const err = "Error occurred";
    err.status = 404;
    return next(err);
  } else if (!otherUser) {
    const err = "User not found";
    err.status = 404;
    return next(err);
  } else {
    const chat = new Chat({
      users: [user._id, otherUser._id],
      messages: [],
      date: Date.now(),
    });

    await chat.save();
    return res
      .status(200)
      .json({ message: "New chat created", chatId: chat._id });
  }
});
