import { Task } from "../models/task.model.js";
import { ApiError } from "../utils/ApiError.js";

const requireTaskAccess = async (req, res, next) => {
  const { taskId } = req.params;

  if (!taskId || taskId.trim() === "") {
    throw new ApiError(400, "Task Id is required");
  }

  const task = await Task.findById(taskId);

  if (!task) {
    throw new ApiError(404, "Task not found");
  }

  if (task.column.toString() !== req.column._id.toString()) {
    throw new ApiError(404, "Task does not belong to the specified column");
  }

  req.task = task;
  next();
};

export { requireTaskAccess };
