import { Router } from "express";
import { verifyJWT } from "../middlewares/auth.middleware.js";
import { requireMember } from "../middlewares/requireWorkspaceMember.js";
import {
  deleteMessage,
  getMessages,
  markMessagesAsRead,
  sendMessage,
} from "../controllers/message.controller.js";
import { messageRateLimiter } from "../middlewares/rateLimit.middleware.js";

const router = Router({ mergeParams: true });

router.post("/", verifyJWT, requireMember, messageRateLimiter, sendMessage);
router.get("/", verifyJWT, requireMember, getMessages);
router.delete("/:messageId", verifyJWT, requireMember, deleteMessage);
router.patch("/mark-read", verifyJWT, requireMember, markMessagesAsRead);

export default router;
