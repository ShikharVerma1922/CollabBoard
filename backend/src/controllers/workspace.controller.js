import { Board } from "../models/board.model.js";
import { Column } from "../models/column.model.js";
import { Comment } from "../models/comment.model.js";
import { Message } from "../models/message.model.js";
import { Task } from "../models/task.model.js";
import { User } from "../models/user.model.js";
import { Workspace } from "../models/workspace.model.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";

const createWorkspace = asyncHandler(async (req, res) => {
  const { title, members = [] } = req.body;
  const creatorId = req.user._id;

  const allMembers = new Set([...members, creatorId]);

  const workspace = await Workspace.create({
    title,
    members: Array.from(allMembers),
    admins: [creatorId],
  });

  return res
    .status(201)
    .json(new ApiResponse(201, workspace, "Workspace created successfully"));
});

const getAllWorkspaces = asyncHandler(async (req, res) => {
  const userId = req.user._id;

  const workspaces = await Workspace.find({ members: userId });

  return res
    .status(200)
    .json(new ApiResponse(200, workspaces, "Workspaces fetched successfully"));
});

const getWorkspaceById = asyncHandler(async (req, res) => {
  const populatedWorkspace = await Workspace.findById(
    req.workspace._id
  ).populate("boards");
  return res
    .status(200)
    .json(
      new ApiResponse(200, populatedWorkspace, "Workspace fetched successfully")
    );
});

const updateWorkspace = asyncHandler(async (req, res) => {
  const { title } = req.body;

  if (!title || title.trim() === "") {
    throw new ApiError(400, "New workspace title is required");
  }

  const workspace = req.workspace;

  workspace.title = title;
  await workspace.save();

  return res
    .status(200)
    .json(new ApiResponse(200, workspace, "Workspace updated successfully"));
});

const deleteWorkspace = asyncHandler(async (req, res) => {
  const workspace = req.workspace;

  const boards = await Board.find({ workspace: workspace._id });
  const boardIds = boards.map((b) => b._id);

  const columns = await Column.find({ board: { $in: boardIds } });
  const columnIds = columns.map((c) => c._id);

  const tasks = await Task.find({ column: { $in: columnIds } });
  const taskIds = tasks.map((t) => t._id);

  await Task.deleteMany({ column: { $in: columnIds } });

  await Column.deleteMany({ board: { $in: boardIds } });

  await Board.deleteMany({ workspace: workspace._id });

  await Message.deleteMany({ workspace: workspace._id });

  await Comment.deleteMany({ task: { $in: taskIds } });

  await workspace.deleteOne();

  return res
    .status(200)
    .json(new ApiResponse(200, null, "Workspace deleted successfully"));
});

const addMembers = asyncHandler(async (req, res) => {
  // get a list of members to be added
  // validate the list - not empty
  // get list of existing users from the list in the User db
  // get the username of this list
  // check for given username not in the this list
  // check for users already existing as a member
  // now add the newMembers list to the db if it is not empty

  const { members } = req.body;

  if (!Array.isArray(members) || members.length === 0) {
    throw new ApiError(400, "Members array is required");
  }

  const users = await User.find({ username: { $in: members } });
  const foundUsernames = users.map((u) => u.username);
  const notFound = members.filter((m) => !foundUsernames.includes(m));
  const userIdsToAdd = users.map((u) => ({
    userId: u._id.toString(),
    username: u.username,
  }));

  const workspace = req.workspace;
  const currentMemberIds = workspace.members.map((id) => id.toString());
  console.log("currentmembers", currentMemberIds);

  const newMembers = userIdsToAdd.filter(
    (u) => !currentMemberIds.includes(u.userId)
  );

  if (newMembers.length === 0) {
    return res
      .status(200)
      .json(new ApiResponse(200, null, "No new members to add"));
  }

  workspace.members = Array.from(
    new Set([
      ...workspace.members.map((id) => id.toString()),
      ...newMembers.map((m) => m.userId),
    ])
  );
  await workspace.save();

  if (req.io) {
    req.io.to(workspace._id.toString()).emit("workspace-members-added", {
      added: newMembers,
      notFound,
    });
  }

  res.status(200).json(
    new ApiResponse(
      200,
      {
        added: newMembers,
        notFound,
      },
      "Members added successfully"
    )
  );
});

const updateAdminStatus = asyncHandler(async (req, res) => {
  const { username, action } = req.body;

  if (!username || !["promote", "demote"].includes(action)) {
    throw new ApiError(
      400,
      "Invalid request: provide username and action ('promote' or 'demote')"
    );
  }

  const user = await User.findOne({ username });
  if (!user) {
    throw new ApiError(404, "User not found");
  }
  const workspace = req.workspace;

  const isMember = workspace.members.some(
    (id) => id.toString() === user._id.toString()
  );

  if (!isMember) {
    throw new ApiError(400, "User must be a member of the workspace");
  }

  const isAdmin = workspace.admins.some(
    (id) => id.toString() === user._id.toString()
  );

  if (action === "promote" && !isAdmin) {
    workspace.admins.push(user._id);
  } else if (action === "demote" && isAdmin) {
    workspace.admins.pull(user._id);
  }

  await workspace.save();

  const adminUsers = await User.find({ _id: { $in: workspace.admins } });
  const adminUsernames = adminUsers.map((u) => u.username);

  if (req.io) {
    req.io.to(workspace._id.toString()).emit("workspace-admins-updated", {
      admins: adminUsernames,
    });
  }

  return res
    .status(200)
    .json(new ApiResponse(200, adminUsernames, `User ${action}d successfully`));
});

const removeMember = asyncHandler(async (req, res) => {
  const { username } = req.body;

  if (!username) {
    throw new ApiError(400, "Username is required");
  }

  const user = await User.findOne({ username });

  if (!user) {
    throw new ApiError(404, "User not found");
  }

  const workspace = req.workspace;

  const isMember = workspace.members.some(
    (id) => id.toString() === user._id.toString()
  );

  if (!isMember) {
    throw new ApiError(400, "User is not a member of this workspace");
  }

  const isSelf = user._id.toString() === req.user._id.toString();

  if (isSelf) {
    throw new ApiError(403, "You cannot remove yourself from the workspace");
  }

  const isAdmin = workspace.admins.some(
    (id) => id.toString() === user._id.toString()
  );

  const isOnlyAdmin = isAdmin && workspace.admins.length === 1;

  if (isOnlyAdmin) {
    throw new ApiError(403, "Cannot remove the only admin from the workspace");
  }

  workspace.members.pull(user._id);
  workspace.admins.pull(user._id);

  await workspace.save();

  if (req.io) {
    req.io.to(workspace._id.toString()).emit("workspace-members-removed", {
      removed: [user._id],
    });
  }

  const remainingMembers = await User.find({ _id: { $in: workspace.members } });
  const memberUsernames = remainingMembers.map((u) => u.username);

  const remainingAdmins = await User.find({ _id: { $in: workspace.admins } });
  const adminUsernames = remainingAdmins.map((u) => u.username);

  return res
    .status(200)
    .json(
      new ApiResponse(
        200,
        { admins: adminUsernames, members: memberUsernames },
        "Member removed successfully"
      )
    );
});

const getWorkspaceMembers = asyncHandler(async (req, res) => {
  const workspace = await req.workspace.populate(
    "members",
    "username fullName"
  );
  const memberList = workspace.members.map((member) => ({
    _id: member._id,
    username: member.username,
    fullName: member.fullName,
    role: workspace.admins.some(
      (adminId) => adminId.toString() === member._id.toString()
    )
      ? "admin"
      : "member",
  }));

  // Determine current user's role
  const currentUserRole = workspace.admins.some(
    (adminId) => adminId.toString() === req.user._id.toString()
  )
    ? "admin"
    : "member";

  return res.status(200).json(
    new ApiResponse(
      200,
      {
        memberList,
        currentUserRole,
        workspace: req.workspace,
      },
      "Workspace members fetched successfully"
    )
  );
});

const leaveWorkspace = asyncHandler(async (req, res) => {
  const userId = req.user._id;
  const workspace = req.workspace;

  const isMember = workspace.members.some(
    (id) => id.toString() === userId.toString()
  );

  if (!isMember) {
    throw new ApiError(400, "You are not a member of this workspace");
  }

  const isAdmin = workspace.admins.some(
    (id) => id.toString() === userId.toString()
  );

  if (isAdmin && workspace.admins.length === 1) {
    throw new ApiError(
      403,
      "You are the only admin. Please assign another admin before leaving"
    );
  }

  workspace.admins.pull(userId);
  workspace.members.pull(userId);
  await workspace.save();

  if (req.io) {
    req.io.to(workspace._id.toString()).emit("workspace-members-removed", {
      removed: [userId],
    });
  }

  return res
    .status(200)
    .json(
      new ApiResponse(200, null, "You have left the workspace successfully")
    );
});

export {
  createWorkspace,
  getAllWorkspaces,
  getWorkspaceById,
  updateWorkspace,
  deleteWorkspace,
  addMembers,
  updateAdminStatus,
  removeMember,
  getWorkspaceMembers,
  leaveWorkspace,
};
