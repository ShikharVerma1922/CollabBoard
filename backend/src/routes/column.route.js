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
router.post(
  "/:columnId/reorder",
  verifyJWT,
  requireMember,
  requireBoardAccess,
  requireColumnAccess,
  async (req, res) => {
    // Implement your reorder logic here
    // Example: req.body.taskOrder = [array of task IDs]
    // You may want to move this logic to a controller if needed
    return res
      .status(200)
      .json({ success: true, message: "Column reordered (stub)!" });
  }
);

export default router;
