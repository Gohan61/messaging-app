import { Router } from "express";
import * as controller from "../controllers/chatController";

const router = Router();

router.post("/new/chat", controller.newChat);

router.post("/new/message", controller.newMessage);

router.get("/all/:username", controller.getAllChats);

router.get("/:sid", controller.getSingleChat);

export default router;
