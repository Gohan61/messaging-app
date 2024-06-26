const User = require("../models/user");
const Chat = require("../models/chats");
const asyncHandler = require("express-async-handler");
const bcrypt = require("bcryptjs");
const { body, validationResult } = require("express-validator");
const passport = require("passport");
const jwt = require("jsonwebtoken");
const { v4: uuidv4 } = require("uuid");

exports.new_chat = asyncHandler(async (req, res, next) => {
  const user = await User.findById(req.body.userId).exec();
  const otherUser = await User.findById(req.body.otherUserId).exec();
  const userIds = [req.body.otherUserId, req.body.userId];
  const existingChats = await Chat.exists({
    users: { $all: userIds },
  }).exec();

  if (!user) {
    const err = { message: "Error occurred", status: 404 };
    return next(err);
  } else if (!otherUser) {
    const err = { message: "User not found", status: 404 };
    return next(err);
  } else if (existingChats) {
    const err = { message: "A chat already exists", status: 404 };
    return next(err);
  } else {
    const chat = new Chat({
      users: [user._id, otherUser._id],
      otherUser: otherUser.username,
      user: user.username,
      messages: [],
      date: Date.now(),
    });

    user.chats.push(chat._id);
    await user.save();
    if (user._id !== otherUser._id) {
      otherUser.chats.push(chat._id);
      await otherUser.save();
    }

    await chat.save();
    return res
      .status(200)
      .json({ message: "New chat created", chatId: chat._id });
  }
});

exports.get_chat = asyncHandler(async (req, res, next) => {
  const chat = await Chat.findById(req.params.chatId).exec();

  if (!chat) {
    const err = { message: "Chat not found", status: 404 };
    return next(err);
  }
  const otherUser = await User.findById(
    chat.users[1],
    "first_name last_name username age bio",
  ).exec();

  if (!otherUser) {
    const err = { message: "User not found", status: 404 };
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
    const chat = await Chat.findById(req.params.chatId).exec();

    if (!chat) {
      const err = { message: "Chat not found", status: 404 };
      return next(err);
    } else if (!errors.isEmpty()) {
      return res.status(500).json({ errors });
    } else {
      chat.messages.push({ message: req.body.message, id: uuidv4() });
      await chat.save();
      return res.status(200).json({ chat });
    }
  }),
];

exports.delete_chat = asyncHandler(async (req, res, next) => {
  const chat = await Chat.findById(req.params.chatId).exec();

  if (!chat) {
    const err = { message: "Chat not found", status: 404 };
    return next(err);
  } else {
    await Chat.findByIdAndDelete(req.params.chatId);
    return res.status(200).json({ message: "Chat deleted" });
  }
});

exports.get_chats = asyncHandler(async (req, res, next) => {
  const userChats = await User.findById(req.params.userId, "chats").exec();
  const chatIds = userChats.chats;
  const chats = await Chat.find({ _id: { $in: chatIds } });

  if (!chats) {
    const err = { message: "No chats found", status: 404 };
    return next(err);
  } else {
    return res.status(200).json({ chats });
  }
});
