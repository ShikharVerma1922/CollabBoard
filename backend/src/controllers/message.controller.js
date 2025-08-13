import { Board } from "../models/board.model.js";
import { Message } from "../models/message.model.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";

const sendMessage = asyncHandler(async (req, res) => {
  const { text, boardId } = req.body;
  const userId = req.user._id;
  const workspace = req.workspace;

  if (!text || text.trim() === "") {
    throw new ApiError(400, "Message text is required");
  }

  let message = await Message.create({
    sender: userId,
    text,
    workspace: workspace._id,
    board: boardId || null,
  });
  message = await message.populate("sender", "username email fullName");

  req.io
    ?.to(boardId ? boardId.toString() : workspace._id.toString())
    ?.emit("message-received", {
      message,
      context: {
        boardId,
        workspaceId: workspace._id,
      },
    });

  return res
    .status(201)
    .json(new ApiResponse(201, message, "Message sent successfully"));
});

const getMessages = asyncHandler(async (req, res) => {
  const workspaceId = req.workspace._id;
  const boardId = req.query.boardId || null;

  if (boardId) {
    const board = await Board.findById(boardId);

    if (!board) {
      throw new ApiError(404, "Board not found");
    }
  }

  const filter = {
    workspace: workspaceId,
    ...(boardId ? { board: boardId } : { board: null }),
  };

  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 20;
  const skip = (page - 1) * limit;

  const messages = await Message.find(filter)
    .populate("sender", "username email fullName")
    .sort({ createdAt: -1 })
    .skip(skip)
    .limit(limit)
    .lean();

  messages.reverse();

  const userId = req.user._id.toString();

  const processedMessages = messages.map((msg) => ({
    ...msg,
    isRead:
      msg.sender._id.toString() === userId ||
      (msg.readBy || []).map((id) => id.toString()).includes(userId),
  }));

  const total = await Message.countDocuments(filter);

  return res
    .status(200)
    .json(
      new ApiResponse(
        200,
        { processedMessages, total, page, limit },
        "Messages fetched successfully"
      )
    );
});

const deleteMessage = asyncHandler(async (req, res) => {
  const userId = req.user._id;
  const { messageId } = req.params;
  const workspace = req.workspace;

  const message = await Message.findById(messageId);

  if (!message) {
    throw new ApiError(404, "Message not found");
  }

  const isSender = userId.toString() === message.sender.toString();

  const isAdmin = workspace.admins.some(
    (id) => id.toString() === userId.toString()
  );

  if (!isSender && !isAdmin) {
    throw new ApiError(
      403,
      "You do not have permission to delete this message"
    );
  }

  await message.deleteOne();

  req.io
    ?.to(message.board ? message.board.toString() : workspace._id.toString())
    ?.emit("message-deleted", {
      messageId: message._id,
      boardId: message.board,
      workspaceId: workspace._id,
    });

  return res
    .status(200)
    .json(new ApiResponse(200, null, "Message deleted successfully"));
});

const markMessagesAsRead = asyncHandler(async (req, res) => {
  const userId = req.user._id;
  const workspaceId = req.workspace._id;
  const boardId = req.query.boardId || null;

  if (!workspaceId) {
    throw new ApiError(400, "Workspace ID is required");
  }

  const filter = {
    workspace: workspaceId,
    readBy: { $ne: userId },
    ...(boardId ? { board: boardId } : {}),
  };

  await Message.updateMany(filter, {
    $push: { readBy: userId },
  });

  return res
    .status(200)
    .json(new ApiResponse(200, null, "Messages marked as read"));
});

export { sendMessage, getMessages, deleteMessage, markMessagesAsRead };
