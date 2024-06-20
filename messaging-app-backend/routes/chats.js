const express = require("express");
const router = express.Router();
const passport = require("passport");

const chat_controller = require("../controllers/ChatController");

router.post(
  "/newchat",
  passport.authenticate("jwt", { session: false }),
  chat_controller.new_chat,
);

router.get(
  "/:chatId",
  passport.authenticate("jwt", { session: false }),
  chat_controller.get_chat,
);

module.exports = router;
