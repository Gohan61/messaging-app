const express = require("express");
const router = express.Router();

const user_controller = require("../controllers/UserController");

router.post("/signin", user_controller.signin);

router.post("/signup", user_controller.signup);

module.exports = router;
