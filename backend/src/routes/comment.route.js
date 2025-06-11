import { Router } from "express";
import { verifyJWT } from "../middlewares/auth.middleware.js";
import { requireMember } from "../middlewares/requireWorkspaceMember.js";
import { requireBoardAccess } from "../middlewares/board.middleware.js";
import { requireColumnAccess } from "../middlewares/column.middleware.js";
import { requireTaskAccess } from "../middlewares/task.middleware.js";
import { commentRateLimiter } from "../middlewares/rateLimit.middleware.js";
import {
  createComment,
  deleteComment,
  getComments,
} from "../controllers/comment.controller.js";

const router = Router({ mergeParams: true });

router.post(
  "/",
  verifyJWT,
  requireMember,
  requireBoardAccess,
  requireColumnAccess,
  requireTaskAccess,
  commentRateLimiter,
  createComment
);
router.get(
  "/",
  verifyJWT,
  requireMember,
  requireBoardAccess,
  requireColumnAccess,
  requireTaskAccess,
  getComments
);
router.delete(
  "/:commentId",
  verifyJWT,
  requireMember,
  requireBoardAccess,
  requireColumnAccess,
  requireTaskAccess,
  deleteComment
);

export default router;
