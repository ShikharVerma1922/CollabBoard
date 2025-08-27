import { ACTIVITY_TYPES } from "../constants.js";
import { Activity } from "../models/activity.model.js";
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

  // log activity
  await Activity.create({
    actor: userId,
    workspace: req.workspace._id,
    board: req.board._id,
    type: ACTIVITY_TYPES.CREATE_TASK,
    target: task._id,
    targetModel: "Task",
    message: `Task "${task.title}" was created by ${req.user.username}.`,
  });

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
  const { title, description, dueDate, assignedTo, completed } = req.body;
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

  // Track changes for activity logging
  const activityMessages = [];
  if (title !== undefined && title.trim() !== "" && title !== task.title) {
    if (!title || title.trim() === "") {
      throw new ApiError(400, "Task title cannot be empty");
    }
    activityMessages.push(
      `Title changed from "${task.title}" to "${title}" by ${req.user.username}.`
    );
    task.title = title;
  }

  if (description !== undefined && description !== task.description) {
    activityMessages.push(`Description updated by ${req.user.username}.`);
    task.description = description;
  }

  if (dueDate !== undefined && dueDate.trim() !== "") {
    const parsedDate = new Date(dueDate);
    if (isNaN(parsedDate.getTime())) {
      throw new ApiError(400, "Invalid dueDate format");
    }
    if (
      !task.dueDate ||
      parsedDate.getTime() !== new Date(task.dueDate).getTime()
    ) {
      activityMessages.push(
        `Due date changed from "${
          task.dueDate ? new Date(task.dueDate).toLocaleDateString() : "None"
        }" to "${parsedDate.toLocaleDateString()}" by ${req.user.username}.`
      );
      task.dueDate = parsedDate;
    }
  }

  if (
    typeof assignedTo === "string" &&
    assignedTo.trim() !== "" &&
    assignedTo !== String(task.assignedTo)
  ) {
    const checkAssignedToUser = await User.findById(assignedTo);
    if (!checkAssignedToUser) {
      throw new ApiError(404, "Assignee does not exists");
    }
    activityMessages.push(
      `Task reassigned from user ID "${task.assignedTo}" to "${assignedTo}" by ${req.user.username}.`
    );
    task.assignedTo = assignedTo;
  }

  if (completed !== undefined && completed !== task.completed) {
    activityMessages.push(
      `Completion status changed from "${task.completed}" to "${completed}" by ${req.user.username}.`
    );
    task.completed = completed;
  }

  await task.save();

  req.io?.to(req.board._id.toString())?.emit("task-updated", task);

  // log activity for each field updated
  for (const msg of activityMessages) {
    await Activity.create({
      actor: userId,
      workspace: req.workspace._id,
      board: req.board._id,
      type: ACTIVITY_TYPES.UPDATE_TASK,
      target: task._id,
      targetModel: "Task",
      message: msg,
    });
  }
  // If no field was changed, log a generic message
  if (activityMessages.length === 0) {
    await Activity.create({
      actor: userId,
      workspace: req.workspace._id,
      board: req.board._id,
      type: ACTIVITY_TYPES.UPDATE_TASK,
      target: task._id,
      targetModel: "Task",
      message: `Task "${task.title}" was updated by ${req.user.username}.`,
    });
  }

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

  req.io?.to(req.board._id.toString())?.emit("task-status-updated", {
    task,
    taskCompleted,
    updatedBy: req.user.username,
  });

  // log activity
  await Activity.create({
    actor: userId,
    workspace: req.workspace._id,
    board: req.board._id,
    type: ACTIVITY_TYPES.UPDATE_TASK_STATUS,
    target: task._id,
    targetModel: "Task",
    message: taskCompleted
      ? `Task "${task.title}" was marked as complete by ${req.user.username}.`
      : `Task "${task.title}" was reopened by ${req.user.username}.`,
  });

  return res
    .status(200)
    .json(new ApiResponse(200, task, "Task status updated successfully"));
});

const moveTaskToColumn = asyncHandler(async (req, res) => {
  const { columnId, position } = req.body;
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
    throw new ApiError(403, "Target column does not exist");
  }

  const oldColumnId = currentColumn._id.toString();
  const newColumnId = nextColumn._id.toString();

  if (oldColumnId === newColumnId && position === task.position) {
    return res.status(200).json(new ApiResponse(200, task, "No change needed"));
  }

  // Remove task from old column
  await Column.updateOne({ _id: oldColumnId }, { $pull: { tasks: task._id } });

  // Insert task at specific position in new column
  await Column.updateOne(
    { _id: newColumnId },
    { $push: { tasks: { $each: [task._id], $position: position ?? 0 } } }
  );

  task.column = newColumnId;
  task.position = position ?? 0;
  await task.save();

  req.io?.to(req.board._id.toString())?.emit("task-moved", {
    taskId: task._id,
    toColumnId: newColumnId,
    position: task.position,
  });

  // log activity
  await Activity.create({
    actor: userId,
    workspace: req.workspace._id,
    board: req.board._id,
    type: ACTIVITY_TYPES.MOVE_TASK,
    target: task._id,
    targetModel: "Task",
    message: `Task "${task.title}" was moved to column "${nextColumn.title}" by ${req.user.username}.`,
  });

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

  // log activity
  await Activity.create({
    actor: userId,
    workspace: req.workspace._id,
    board: req.board._id,
    type: ACTIVITY_TYPES.DELETE_TASK,
    target: task._id,
    targetModel: "Task",
    message: `Task "${task.title}" was deleted by ${req.user.username}.`,
  });

  return res
    .status(200)
    .json(new ApiResponse(200, null, "Task deleted successfully"));
});

// get task by ID
const getTaskById = asyncHandler(async (req, res) => {
  const task = await Task.findById(req.task._id)
    .populate({
      path: "column",
      select: "title",
    })
    // .populate({
    //   path: "assignedTo",
    //   select: "username fullName",
    // })
    .populate({
      path: "createdBy",
      select: "username fullName",
    })
    .lean();

  const isCreator = req.task.createdBy.toString() === req.user._id.toString();
  const isAssignedUser =
    req.task.assignedTo?.toString() === req.user._id.toString();

  return res
    .status(200)
    .json(
      new ApiResponse(
        200,
        { ...task, isCreator, isAssignedUser },
        "Task fetched successfully"
      )
    );
});

// reorder tasks in column
const reorderTaskInColumn = asyncHandler(async (req, res) => {
  const { taskOrder } = req.body;
  const column = req.column;

  if (!taskOrder || !Array.isArray(taskOrder)) {
    throw new ApiError(400, "Task order must be an array of task IDs");
  }

  const tasks = await Task.find({ _id: { $in: taskOrder } });

  column.tasks = taskOrder;
  await column.save();

  for (let i = 0; i < taskOrder.length; i++) {
    const task = tasks.find((t) => t._id.toString() === taskOrder[i]);
    if (task && task.column.toString() === req.column._id.toString()) {
      task.position = i;
      await task.save();
    }
  }

  // tasks.req.io?.to(req.board._id.toString())?.emit("tasks-reordered", {
  //   columnId: column._id,
  //   taskOrder,
  // });

  return res
    .status(200)
    .json(new ApiResponse(200, null, "Task position updated successfully"));
});

const getAssignedTasks = asyncHandler(async (req, res) => {
  const assignedTasks = await Task.aggregate([
    {
      $match: {
        assignedTo: req.user._id,
        completed: false,
      },
    },
    // Lookup column
    {
      $lookup: {
        from: "columns",
        localField: "column",
        foreignField: "_id",
        as: "column",
      },
    },
    { $unwind: "$column" },
    // Lookup board
    {
      $lookup: {
        from: "boards",
        localField: "column.board",
        foreignField: "_id",
        as: "board",
      },
    },
    { $unwind: "$board" },
    // Lookup workspace
    {
      $lookup: {
        from: "workspaces",
        localField: "board.workspace",
        foreignField: "_id",
        as: "workspace",
      },
    },
    { $unwind: "$workspace" },
    // Add fields
    {
      $addFields: {
        isDueDateNull: { $eq: ["$dueDate", null] },
        workspaceInfo: {
          _id: "$workspace._id",
          title: "$workspace.title",
        },
        boardInfo: {
          _id: "$board._id",
          title: "$board.title",
        },
        columnInfo: {
          _id: "$column._id",
          title: "$column.title",
        },
      },
    },
    // Sort: non-null due dates ascending, null due dates last
    {
      $sort: {
        isDueDateNull: 1,
        dueDate: 1,
      },
    },
    // Clean output
    {
      $project: {
        title: 1,
        description: 1,
        dueDate: 1,
        completed: 1,
        assignedTo: 1,
        workspaceInfo: 1,
        boardInfo: 1,
        columnInfo: 1,
      },
    },
  ]);

  return res
    .status(200)
    .json(
      new ApiResponse(200, assignedTasks, "Assigned tasks fetched successfully")
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
  getAssignedTasks,
};
