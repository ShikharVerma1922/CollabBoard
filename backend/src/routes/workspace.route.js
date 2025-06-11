import { Router } from "express";
import { verifyJWT } from "../middlewares/auth.middleware.js";
import {
  addMembers,
  createWorkspace,
  deleteWorkspace,
  getAllWorkspaces,
  getWorkspaceById,
  leaveWorkspace,
  removeMember,
  updateAdminStatus,
  updateWorkspace,
} from "../controllers/workspace.controller.js";
import { requireMember } from "../middlewares/requireWorkspaceMember.js";
import { requireAdmin } from "../middlewares/requireWorkspaceAdmin.js";

const router = Router();

router.post("/", verifyJWT, createWorkspace);
router.get("/", verifyJWT, getAllWorkspaces);
router.get("/:workspaceId", verifyJWT, requireMember, getWorkspaceById);
router.patch("/:workspaceId", verifyJWT, requireAdmin, updateWorkspace);
router.delete("/:workspaceId", verifyJWT, requireAdmin, deleteWorkspace);
router.post("/:workspaceId/members", verifyJWT, requireAdmin, addMembers);
router.patch(
  "/:workspaceId/admins",
  verifyJWT,
  requireAdmin,
  updateAdminStatus
);
router.delete("/:workspaceId/members", verifyJWT, requireAdmin, removeMember);
router.post("/:workspaceId/leave", verifyJWT, requireMember, leaveWorkspace);

export default router;
