import { Router } from "express";
import * as controller from "../controllers/chatController";

const router = Router();

router.post("/new/chat", controller.newChat);

router.post("/new/message", controller.newMessage);

router.get("/all/:username", controller.getAllChats);

router.get("/:sid", controller.getSingleChat);

router.delete("/message/:messageId/:username", controller.deleteMessage);

router.delete("/:sid/:username", controller.deleteChat);

export default router;
