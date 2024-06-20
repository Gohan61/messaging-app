const express = require("express");
const router = express.Router();
const passport = require("passport");

const user_controller = require("../controllers/UserController");

router.post("/signin", user_controller.signin);

router.post("/signup", user_controller.signup);

router.get(
  "/userlist",
  passport.authenticate("jwt", { session: false }),
  user_controller.userlist,
);

router.get(
  "/:userId",
  passport.authenticate("jwt", { session: false }),
  user_controller.profile,
);

router.put(
  "/:userId",
  passport.authenticate("jwt", { session: false }),
  user_controller.update_profile,
);

module.exports = router;
