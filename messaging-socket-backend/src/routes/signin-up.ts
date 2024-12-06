import { Router } from "express";
import * as controller from "../controllers/signin-up-control";

const router = Router();

router.post("/signin", controller.signin);

router.post("/signup", controller.signup);

export default router;
