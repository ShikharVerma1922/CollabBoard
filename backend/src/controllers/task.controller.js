import { Column } from "../models/column.model.js";
import { Comment } from "../models/comment.model.js";
import { Task } from "../models/task.model.js";
import { User } from "../models/user.model.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";

const createTask = asyncHandler(async (req, res) => {
  const { title } = req.body;
  const description = req.body.description || "";
  const dueDate = req.body.dueDate ? new Date(req.body.dueDate) : null;
  const assignedTo = req.body.assignedTo || null;
  const column = req.column;
  const userId = req.user._id;

  if (!title || title.trim() === "") {
    throw new ApiError(400, "Task title is required");
  }

  if (dueDate && isNaN(dueDate.getTime())) {
    throw new ApiError(400, "Invalid dueDate format");
  }

  const taskCount = await Task.countDocuments({ column: column._id });

  const task = await Task.create({
    title,
    description,
    dueDate,
    assignedTo,
    createdBy: userId,
    column: column._id,
    position: taskCount,
  });

  column.tasks.push(task._id);
  await column.save();

  try {
    console.log("Emitting 'task-created' to board:", req.board._id.toString());
    // req.io?.to(req.board._id.toString())?.emit("task-created", task);
    req.io.emit("task-created", { task, createdBy: req.user.username });
  } catch (err) {
    console.error("Socket emit failed:", err);
  }
  return res
    .status(201)
    .json(new ApiResponse(201, task, "Task created successfully"));
});

const updateTaskMetadata = asyncHandler(async (req, res) => {
  const { title, description, dueDate, assignedTo } = req.body;
  const task = req.task;

  const userId = req.user._id;
  const isAdmin = req.workspace.admins.some(
    (id) => id.toString() === userId.toString()
  );
  const isCreator = req.task.createdBy.toString() === userId.toString();
  const isAssignedUser = req.task.assignedTo?.toString() === userId.toString();

  const isAllowedToEdit = isAdmin || isCreator || isAssignedUser;
  const isAllowedToReassign = isAdmin || isCreator;

  if (!isAllowedToEdit) {
    throw new ApiError(403, "You do not have permission to update this task");
  }

  if (assignedTo !== undefined && !isAllowedToReassign) {
    throw new ApiError(403, "You cannot reassign this task");
  }

  if (title !== undefined) {
    if (!title || title.trim() === "") {
      throw new ApiError(400, "Task title cannot be empty");
    }
    task.title = title;
  }

  if (description !== undefined) {
    task.description = description;
  }

  if (dueDate !== undefined) {
    const parsedDate = new Date(dueDate);
    if (isNaN(parsedDate.getTime())) {
      throw new ApiError(400, "Invalid dueDate format");
    }
    task.dueDate = parsedDate;
  }

  if (assignedTo !== undefined) {
    const checkAssignedToUser = await User.findById(assignedTo);
    if (!checkAssignedToUser) {
      throw new ApiError(404, "Assignee does not exists");
    }
    task.assignedTo = assignedTo;
  }

  await task.save();

  req.io?.to(req.board._id.toString())?.emit("task-updated", task);

  return res
    .status(200)
    .json(new ApiResponse(200, task, "Task updated successfully"));
});

const updateTaskStatus = asyncHandler(async (req, res) => {
  const { taskCompleted } = req.body;
  const task = req.task;

  const userId = req.user._id;
  const isAdmin = req.workspace.admins.some(
    (id) => id.toString() === userId.toString()
  );
  const isCreator = req.task.createdBy.toString() === userId.toString();
  const isAssignedUser = req.task.assignedTo?.toString() === userId.toString();

  const isAllowedToEdit = isAdmin || isCreator || isAssignedUser;

  if (!isAllowedToEdit) {
    throw new ApiError(403, "You do not have permission to update this task");
  }

  if (typeof taskCompleted !== "boolean") {
    throw new ApiError(400, "Task status must be a boolean");
  }

  task.completed = taskCompleted;
  await task.save();

  req.io
    ?.to(req.board._id.toString())
    ?.emit("task-status-updated", {
      task,
      taskCompleted,
      updatedBy: req.user.username,
    });

  return res
    .status(200)
    .json(new ApiResponse(200, task, "Task status updated successfully"));
});

const moveTaskToColumn = asyncHandler(async (req, res) => {
  const { columnId } = req.body;
  const task = req.task;
  const currentColumn = req.column;

  const userId = req.user._id;
  const isAdmin = req.workspace.admins.some(
    (id) => id.toString() === userId.toString()
  );
  const isCreator = req.task.createdBy.toString() === userId.toString();
  const isAssignedUser = req.task.assignedTo?.toString() === userId.toString();

  if (!isAdmin && !isCreator && !isAssignedUser) {
    throw new ApiError(403, "You do not have permission to move this task");
  }
  if (!columnId || columnId.trim() === "") {
    throw new ApiError(400, "Column id is required");
  }

  const nextColumn = await Column.findById(columnId);
  if (!nextColumn) {
    throw new ApiError(403, "Column (where to move task) does not exists");
  }

  if (columnId === req.column._id.toString()) {
    throw new ApiError(400, "Task is already in the specified column");
  }

  const taskCount = await Task.countDocuments({ column: columnId });

  task.column = columnId;
  task.position = taskCount;
  await task.save();

  currentColumn.tasks.pull(task._id);
  await currentColumn.save();

  nextColumn.tasks.push(task._id);
  await nextColumn.save();

  req.io?.to(req.board._id.toString())?.emit("task-moved", task);

  return res
    .status(200)
    .json(new ApiResponse(200, task, "Task moved successfully"));
});

const deleteTask = asyncHandler(async (req, res) => {
  const task = req.task;
  const column = req.column;

  const userId = req.user._id;
  const isAdmin = req.workspace.admins.some(
    (id) => id.toString() === userId.toString()
  );
  const isCreator = req.task.createdBy.toString() === userId.toString();

  if (!isAdmin && !isCreator) {
    throw new ApiError(403, "You do not have permission to delete this task");
  }

  column.tasks.pull(task._id);
  await column.save();

  await Comment.deleteMany({ task: task._id });

  await task.deleteOne();

  req.io
    ?.to(req.board._id.toString())
    ?.emit("task-deleted", { taskId: task._id });

  return res
    .status(200)
    .json(new ApiResponse(200, null, "Task deleted successfully"));
});

// get task by ID
const getTaskById = asyncHandler(async (req, res) => {
  const task = req.task;

  return res
    .status(200)
    .json(new ApiResponse(200, task, "Task fetched successfully"));
});

// reorder tasks in column
const reorderTaskInColumn = asyncHandler(async (req, res) => {
  const { taskOrder } = req.body;

  if (!taskOrder || !Array.isArray(taskOrder)) {
    throw new ApiError(400, "Task order must be an array of task IDs");
  }

  const tasks = await Task.find({ _id: { $in: taskOrder } });

  const taskMap = new Map(tasks.map((t) => [t._id.toString(), t]));

  for (let i = 0; i < taskOrder.length; i++) {
    let taskId = taskOrder[i];
    let task = taskMap.get(taskId.toString());

    if (task) {
      task.position = i;
      await task.save();
    }
  }
  req.io?.to(req.board._id.toString())?.emit("tasks-reordered", {
    columnId: req.column._id,
    taskOrder,
  });
  return res
    .status(200)
    .json(
      new ApiResponse(
        200,
        null,
        "Task position updated successfully successfully"
      )
    );
});

export {
  createTask,
  updateTaskMetadata,
  moveTaskToColumn,
  deleteTask,
  getTaskById,
  reorderTaskInColumn,
  updateTaskStatus,
};
