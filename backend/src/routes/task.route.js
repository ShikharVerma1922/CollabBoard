import { Router } from "express";
import { verifyJWT } from "../middlewares/auth.middleware.js";
import { requireMember } from "../middlewares/requireWorkspaceMember.js";
import { requireBoardAccess } from "../middlewares/board.middleware.js";
import {
  createTask,
  deleteTask,
  getTaskById,
  moveTaskToColumn,
  reorderTaskInColumn,
  updateTaskMetadata,
  updateTaskStatus,
} from "../controllers/task.controller.js";
import { requireColumnAccess } from "../middlewares/column.middleware.js";
import { requireTaskAccess } from "../middlewares/task.middleware.js";

const router = Router({ mergeParams: true });

router.post(
  "/",
  verifyJWT,
  requireMember,
  requireBoardAccess,
  requireColumnAccess,
  createTask
);
router.patch(
  "/:taskId",
  verifyJWT,
  requireMember,
  requireBoardAccess,
  requireColumnAccess,
  requireTaskAccess,
  updateTaskMetadata
);
router.patch(
  "/:taskId/status",
  verifyJWT,
  requireMember,
  requireBoardAccess,
  requireColumnAccess,
  requireTaskAccess,
  updateTaskStatus
);
router.post(
  "/:taskId/move",
  verifyJWT,
  requireMember,
  requireBoardAccess,
  requireColumnAccess,
  requireTaskAccess,
  moveTaskToColumn
);
router.delete(
  "/:taskId",
  verifyJWT,
  requireMember,
  requireBoardAccess,
  requireColumnAccess,
  requireTaskAccess,
  deleteTask
);
router.get(
  "/:taskId",
  verifyJWT,
  requireMember,
  requireBoardAccess,
  requireColumnAccess,
  requireTaskAccess,
  getTaskById
);
router.post(
  "/",
  verifyJWT,
  requireMember,
  requireBoardAccess,
  requireColumnAccess,
  reorderTaskInColumn
);

export default router;
