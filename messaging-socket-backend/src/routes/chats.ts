import { Router } from "express";
import * as controller from "../controllers/chatController";

const router = Router();

router.post("/new/chat", controller.newChat);

router.post("/new/message", controller.newMessage);

router.get("/all", controller.getAllChats);

export default router;
