import { Board } from "../models/board.model.js";
import { Column } from "../models/column.model.js";
import { Comment } from "../models/comment.model.js";
import { Message } from "../models/message.model.js";
import { Task } from "../models/task.model.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";

const createBoard = asyncHandler(async (req, res) => {
  const userId = req.user._id;
  const workspace = req.workspace;
  const { title, description, visibility } = req.body;

  if (!title || title.trim() === "") {
    throw new ApiError(400, "Board title is required");
  }

  const createdBoard = await Board.create({
    title,
    description: description || null,
    visibility: visibility,
    workspace: workspace._id,
    createdBy: userId,
  });

  workspace.boards.push(createdBoard._id);
  await workspace.save();

  req.io?.to(workspace._id.toString()).emit("board-created", createdBoard);

  return res
    .status(201)
    .json(new ApiResponse(201, createdBoard, "Board created successfully"));
});

const getBoardById = asyncHandler(async (req, res) => {
  const board = req.board;

  return res
    .status(200)
    .json(new ApiResponse(200, board, "Board fetched successfully"));
});

const updateBoardMetadata = asyncHandler(async (req, res) => {
  const { title, description, visibility } = req.body;
  const board = req.board;

  // if (!title || title.trim() === "") {
  //   throw new ApiError(400, "New board title is required");
  // }

  const isAdmin = req.workspace.admins.some(
    (id) => id.toString() === req.user._id.toString()
  );

  const isCreator = board.createdBy.toString() === req.user._id.toString();

  if (!isAdmin && !isCreator) {
    throw new ApiError(403, "You do not have permission to update this board");
  }

  if (title && title.trim() !== "") board.title = title;

  if (description && description.trim() !== "") board.description = description;

  if (visibility && ["private", "public"].some((i) => i === visibility))
    board.visibility = visibility;

  await board.save();

  req.io?.to(board._id.toString()).emit("board-updated", board);

  return res
    .status(200)
    .json(new ApiResponse(200, board, "Board updated successfully"));
});

const deleteBoard = asyncHandler(async (req, res) => {
  const board = req.board;
  const workspace = req.workspace;

  const isAdmin = workspace.admins.some(
    (id) => id.toString() === req.user._id.toString()
  );

  const isCreator = board.createdBy.toString() === req.user._id.toString();

  if (!isAdmin && !isCreator) {
    throw new ApiError(403, "You do not have permission to delete this board");
  }

  const columns = await Column.find({ board: board._id });
  const columnIds = columns.map((c) => c._id);

  const tasks = await Task.find({ column: { $in: columnIds } });
  const taskIds = tasks.map((t) => t._id);

  await Column.deleteMany({ board: board._id });

  await Task.deleteMany({ column: { $in: columnIds } });

  await Message.deleteMany({ board: board._id });

  await Comment.deleteMany({ task: { $in: taskIds } });

  workspace.boards.pull(board._id);
  await workspace.save();

  await board.deleteOne();

  req.io
    ?.to(board._id.toString())
    .emit("board-deleted", { boardId: board._id });

  return res
    .status(200)
    .json(new ApiResponse(200, null, "Board deleted successfully"));
});

const getAllBoardsForWorkspace = asyncHandler(async (req, res) => {
  const workspaceId = req.workspace._id;

  const boards = await Board.find({ workspace: workspaceId });

  return res
    .status(200)
    .json(new ApiResponse(200, boards, "Boards fetched successfully"));
});

// Reorder column
const reorderColumns = asyncHandler(async (req, res) => {
  const { columnOrder } = req.body;
  const board = req.board;

  const isAdmin = req.workspace.admins.some(
    (id) => id.toString() === req.user._id.toString()
  );

  const isCreator = board.createdBy.toString() === req.user._id.toString();

  if (!isAdmin && !isCreator) {
    throw new ApiError(403, "You do not have permission to update this board");
  }

  if (!Array.isArray(columnOrder) || columnOrder.length === 0) {
    throw new ApiError(400, "A valid column array is required");
  }

  board.column = columnOrder;
  await board.save();

  req.io?.to(board._id.toString()).emit("board-columns-reordered", {
    columnOrder,
    boardId: board._id,
  });

  return res
    .status(200)
    .json(new ApiResponse(200, board, "Column order updated sucessfully"));
});

export {
  createBoard,
  getBoardById,
  updateBoardMetadata,
  deleteBoard,
  getAllBoardsForWorkspace,
  reorderColumns,
};
