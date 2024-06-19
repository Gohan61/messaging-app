const express = require("express");
const router = express.Router();

const user_controller = require("../controllers/UserController");

router.post("/signup", user_controller.signup);

module.exports = router;
