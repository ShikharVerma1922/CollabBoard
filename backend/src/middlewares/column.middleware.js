import { Column } from "../models/column.model.js";
import { ApiError } from "../utils/ApiError.js";
import { asyncHandler } from "../utils/asyncHandler.js";

export const requireColumnAccess = asyncHandler(async (req, res, next) => {
  const { columnId } = req.params;

  if (!columnId || columnId.trim() === "") {
    throw new ApiError(400, "Column ID is required");
  }

  const column = await Column.findById(columnId);
  if (!column) {
    throw new ApiError(404, "Column not found");
  }

  if (column.board.toString() !== req.board._id.toString()) {
    throw new ApiError(403, "Column does not belong to this board");
  }

  req.column = column;
  next();
});
