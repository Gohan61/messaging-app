import { Router } from "express";
import * as controller from "../controllers/userController";

const router = Router();

router.get("/list", controller.getUserList);

router.get("/:username", controller.getUserProfile);

router.put("/:username", controller.updateUser);

export default router;
