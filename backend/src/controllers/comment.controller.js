import { Comment } from "../models/comment.model.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";

const createComment = asyncHandler(async (req, res) => {
  const { text } = req.body;

  if (!text || text.trim() === "") {
    throw new ApiError(400, "Comment text is required");
  }

  const comment = await Comment.create({
    author: req.user._id,
    task: req.task._id,
    text,
  });

  return res
    .status(201)
    .json(new ApiResponse(201, comment, "Comment created successfully"));
});

const getComments = asyncHandler(async (req, res) => {
  const task = req.task;

  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 20;
  const skip = (page - 1) * limit;

  const comments = await Comment.find({ task: task._id })
    .populate("author", "email username")
    .sort({ createdAt: 1 })
    .skip(skip)
    .limit(limit);

  const total = await Comment.countDocuments();

  return res
    .status(200)
    .json(
      new ApiResponse(
        200,
        { comments, total, page, limit },
        "Comments fetched successfully"
      )
    );
});

const deleteComment = asyncHandler(async (req, res) => {
  const { commentId } = req.params;
  const userId = req.user._id;

  const comment = await Comment.findById(commentId);

  if (!comment) {
    throw new ApiError(404, "Comment not found");
  }

  const isAuthor = comment.author.toString() === userId.toString();

  const isAdmin = req.workspace.admins.some(
    (id) => id.toString() === userId.toString()
  );

  if (!isAuthor && !isAdmin) {
    throw new ApiError(
      403,
      "You do not have permission to delete this comment"
    );
  }

  await comment.deleteOne();

  return res
    .status(200)
    .json(new ApiResponse(200, null, "Comment deleted successfully"));
});

export { createComment, getComments, deleteComment };
