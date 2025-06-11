import { Column } from "../models/column.model.js";
import { Comment } from "../models/comment.model.js";
import { Task } from "../models/task.model.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";

const createColumn = asyncHandler(async (req, res) => {
  const { title, description, color, visibility } = req.body;
  const userId = req.user._id;
  const board = req.board;

  const isAdmin = req.workspace.admins.some(
    (id) => id.toString() === userId.toString()
  );

  const isCreator = board.createdBy.toString() === userId.toString();

  if (!isAdmin && !isCreator) {
    throw new ApiError(403, "You do not have permission to create columns");
  }

  if (!title || title.trim() === "") {
    throw new ApiError(400, "Column title is required");
  }

  const column = await Column.create({
    title,
    board: board._id,
    createdBy: userId,
    description: description || null,
    visibility,
    color,
  });

  board.columns.push(column._id);
  await board.save();

  req.io?.to(board._id.toString())?.emit("column-created", column);
  return res
    .status(201)
    .json(new ApiResponse(201, column, "Column created successfully"));
});

const updateColumnMetadata = asyncHandler(async (req, res) => {
  const { title, description, color } = req.body;
  const userId = req.user._id;
  const board = req.board;
  const column = req.column;

  // if (!title || title.trim() === "") {
  //   throw new ApiError(400, "Column title is required");
  // }

  const isAdmin = req.workspace.admins.some(
    (id) => id.toString() === userId.toString()
  );

  const isCreator = board.createdBy.toString() === userId.toString();

  if (!isAdmin && !isCreator) {
    throw new ApiError(403, "You do not have permission to update columns");
  }

  if (title && title.trim() !== "") column.title = title;

  if (description && description.trim() !== "")
    column.description = description;

  if (color && color.trim() !== "") column.color = color;

  if (visibility && ["private", "public"].some((i) => i === visibility))
    column.visibility = visibility;

  await column.save();
  req.io?.to(board._id.toString())?.emit("column-updated", column);
  return res
    .status(200)
    .json(new ApiResponse(200, column, "Column updated successfully"));
});

const deleteColumn = asyncHandler(async (req, res) => {
  const userId = req.user._id;
  const board = req.board;
  const column = req.column;

  const isAdmin = req.workspace.admins.some(
    (id) => id.toString() === userId.toString()
  );

  const isCreator = board.createdBy.toString() === userId.toString();

  if (!isAdmin && !isCreator) {
    throw new ApiError(403, "You do not have permission to delete columns");
  }

  board.columns.pull(column._id);
  await board.save();

  const tasks = await Task.find({ column: column._id });
  const taskIds = tasks.map((t) => t._id);

  await Task.deleteMany({ column: column._id });

  await Comment.deleteMany({ task: { $in: taskIds } });

  await column.deleteOne();
  req.io
    ?.to(board._id.toString())
    ?.emit("column-deleted", { columnId: column._id });
  return res
    .status(200)
    .json(new ApiResponse(200, null, "Column deleted successfully"));
});

// get all tasks for column
const getTasksForColumn = asyncHandler(async (req, res) => {
  const columnId = req.column._id;

  const tasks = await Task.find({ column: columnId }).sort({ position: 1 });

  return res
    .status(200)
    .json(new ApiResponse(200, tasks, "Tasks fetched successfully"));
});

const getColumnById = asyncHandler(async (req, res) => {
  const column = req.column;

  return res
    .status(200)
    .json(new ApiResponse(200, column, "Column fetched successfully"));
});

export {
  createColumn,
  updateColumnMetadata,
  deleteColumn,
  getTasksForColumn,
  getColumnById,
};
