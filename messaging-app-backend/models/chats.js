const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const ChatSchema = new Schema({
  users: [{ type: Schema.Types.ObjectId, ref: "User", required: true }],
  messages: { type: Array, required: false, minLength: 1, maxLength: 400 },
  date: { type: String, required: true },
});

module.exports = mongoose.model("Chats", ChatSchema);