import { Workspace } from "../models/workspace.model.js";
import { ApiError } from "../utils/ApiError.js";

export const requireMember = async (req, res, next) => {
  const workspaceId = req.params.workspaceId || req.body.workspaceId;
  const userId = req.user._id;

  const workspace = await Workspace.findById(workspaceId);

  if (!workspace) {
    throw new ApiError(404, "Workspace does not exists");
  }

  if (!workspace.members.includes(userId)) {
    throw new ApiError(403, "You are not a member of this workspace");
  }

  req.workspace = workspace;
  next();
};
