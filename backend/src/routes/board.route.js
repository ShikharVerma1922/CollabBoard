import { Router } from "express";
import { verifyJWT } from "../middlewares/auth.middleware.js";
import { requireMember } from "../middlewares/requireWorkspaceMember.js";
import {
  createBoard,
  deleteBoard,
  getAllBoardsForWorkspace,
  getBoardById,
  getRecentBoards,
  reorderColumns,
  toggleFavourite,
  updateBoardMetadata,
} from "../controllers/board.controller.js";
import { requireBoardAccess } from "../middlewares/board.middleware.js";

const router = Router({ mergeParams: true });

router.post("/", verifyJWT, requireMember, createBoard);
router.get(
  "/:boardId",
  verifyJWT,
  requireMember,
  requireBoardAccess,
  getBoardById
);
router.patch(
  "/:boardId",
  verifyJWT,
  requireMember,
  requireBoardAccess,
  updateBoardMetadata
);
router.delete(
  "/:boardId",
  verifyJWT,
  requireMember,
  requireBoardAccess,
  deleteBoard
);
router.get("/", verifyJWT, requireMember, getAllBoardsForWorkspace);
router.post(
  "/:boardId",
  verifyJWT,
  requireMember,
  requireBoardAccess,
  reorderColumns
);
router.patch(
  "/:boardId/toggle-favourite",
  verifyJWT,
  requireMember,
  requireBoardAccess,
  toggleFavourite
);

export default router;
