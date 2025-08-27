import { Activity } from "../models/activity.model.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";

const getBoardActivities = asyncHandler(async (req, res) => {
  // Extract pagination params from query, with defaults
  let { page = 1, limit = 10, type, from, to } = req.query;
  page = parseInt(page, 10);
  limit = parseInt(limit, 10);
  if (isNaN(page) || page < 1) page = 1;
  if (isNaN(limit) || limit < 1) limit = 10;
  const skip = (page - 1) * limit;

  const query = { board: req.board._id };
  if (type) {
    query.type = type;
  }
  // Date filtering logic
  if (from && to) {
    query.createdAt = {
      $gte: new Date(from),
      $lte: new Date(new Date(to).setHours(23, 59, 59, 999)),
    };
  } else if (from) {
    query.createdAt = { $gte: new Date(from) };
  } else if (to) {
    query.createdAt = {
      $lte: new Date(new Date(to).setHours(23, 59, 59, 999)),
    };
  }

  // Count total activities for pagination
  const totalDocs = await Activity.countDocuments(query);
  const totalPages = Math.ceil(totalDocs / limit);

  const activities = await Activity.find(query)
    .populate({
      path: "actor",
      select: "username fullName",
    })
    .populate({
      path: "workspace",
      select: "title",
    })
    .populate({ path: "board", select: "title" })
    .populate({
      path: "target",
      select: "title",
      populate: {
        path: "column",
        select: "title",
      },
    })
    .sort({ createdAt: -1 })
    .skip(skip)
    .limit(limit);

  return res.status(200).json(
    new ApiResponse(
      200,
      {
        activities,
        page,
        limit,
        totalPages,
        totalDocs,
      },
      "Board activities fetched successfully"
    )
  );
});

export { getBoardActivities };
