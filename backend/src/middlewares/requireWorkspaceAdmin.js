import { Workspace } from "../models/workspace.model.js";
import { ApiError } from "../utils/ApiError.js";

export const requireAdmin = async (req, res, next) => {
  const workspaceId = req.params.workspaceId || req.body.workspaceId;
  const userId = req.user._id;

  const workspace = await Workspace.findById(workspaceId);

  if (!workspace) {
    throw new ApiError(404, "Workspace does not exists");
  }

  if (!workspace.admins.includes(userId)) {
    throw new ApiError(403, "Admin access required");
  }

  req.workspace = workspace;
  next();
};
