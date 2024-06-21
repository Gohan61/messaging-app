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

    user.chats.push(chat._id);
    await user.save();
    console.log(user.chats);
    otherUser.chats.push(chat._id);
    await otherUser.save();

    await chat.save();
    return res
      .status(200)
      .json({ message: "New chat created", chatId: chat._id });
  }
});

exports.get_chat = asyncHandler(async (req, res, next) => {
  const chat = await Chat.findById(req.params.chatId);

  if (!chat) {
    const err = "Chat not found";
    err.status = 404;
    return next(err);
  }
  const otherUser = await User.findById(chat.users[1]);

  if (!otherUser) {
    const err = "User not found";
    err.status = 404;
    return next(err);
  } else {
    return res.status(200).json({ chat, otherUser });
  }
});

exports.send_chat = [
  body("message", "Message cannot be empty")
    .trim()
    .isLength({ min: 1 })
    .escape(),

  asyncHandler(async (req, res, next) => {
    const errors = validationResult(req);
    const chat = await Chat.findById(req.params.chatId);

    if (!chat) {
      const err = "Chat not found";
      err.status = 404;
      return next(err);
    } else if (!errors.isEmpty()) {
      return res.status(500).json({ errors });
    } else {
      chat.messages.push(req.body.message);
      await chat.save();
      return res.status(200).json({ chat });
    }
  }),
];
