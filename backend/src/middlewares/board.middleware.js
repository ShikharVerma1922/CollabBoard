// middlewares/board.middleware.js
import { Board } from "../models/board.model.js";
import { ApiError } from "../utils/ApiError.js";
import { asyncHandler } from "../utils/asyncHandler.js";

export const requireBoardAccess = asyncHandler(async (req, res, next) => {
  const { boardId } = req.params;

  if (!boardId || boardId.trim() === "") {
    throw new ApiError(400, "Board ID is required");
  }

  const board = await Board.findById(boardId);
  if (!board) {
    throw new ApiError(404, "Board not found");
  }

  if (board.workspace.toString() !== req.workspace._id.toString()) {
    throw new ApiError(403, "Board does not belong to this workspace");
  }

  req.board = board;
  next();
});
