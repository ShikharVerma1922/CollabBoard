import { Router } from "express";
import { verifyJWT } from "../middlewares/auth.middleware.js";
import { requireMember } from "../middlewares/requireWorkspaceMember.js";
import { requireBoardAccess } from "../middlewares/board.middleware.js";
import {
  createColumn,
  deleteColumn,
  getColumnById,
  getTasksForColumn,
  updateColumnMetadata,
} from "../controllers/column.controller.js";
import { requireColumnAccess } from "../middlewares/column.middleware.js";

const router = Router({ mergeParams: true });

router.post("/", verifyJWT, requireMember, requireBoardAccess, createColumn);
router.patch(
  "/:columnId",
  verifyJWT,
  requireMember,
  requireBoardAccess,
  requireColumnAccess,
  updateColumnMetadata
);
router.delete(
  "/:columnId",
  verifyJWT,
  requireMember,
  requireBoardAccess,
  requireColumnAccess,
  deleteColumn
);
router.get(
  "/:columnId/tasks",
  verifyJWT,
  requireMember,
  requireBoardAccess,
  requireColumnAccess,
  getTasksForColumn
);
router.get(
  "/:columnId",
  verifyJWT,
  requireMember,
  requireBoardAccess,
  requireColumnAccess,
  getColumnById
);

export default router;
