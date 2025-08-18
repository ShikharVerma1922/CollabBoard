import express from "express";
import { getBoardActivities } from "../controllers/activity.controller.js";
import { verifyJWT } from "../middlewares/auth.middleware.js";
import { requireMember } from "../middlewares/requireWorkspaceMember.js";
import { requireBoardAccess } from "../middlewares/board.middleware.js";

const router = express.Router({ mergeParams: true });

router.get(
  "/boards/:boardId",
  verifyJWT,
  requireMember,
  requireBoardAccess,
  getBoardActivities
);

export default router;
