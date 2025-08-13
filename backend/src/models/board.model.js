import mongoose, { Schema } from "mongoose";

const boardSchema = new Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true,
    },
    description: {
      type: String,
    },
    visibility: {
      type: String,
      enum: ["private", "public"],
      default: "public",
      required: true,
    },
    workspace: {
      type: Schema.Types.ObjectId,
      ref: "Workspace",
      required: true,
    },
    createdBy: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    columns: [
      {
        type: Schema.Types.ObjectId,
        ref: "Column",
      },
    ],
    lastOpenedAt: {
      type: Date,
      default: Date.now,
    },
    favourite: {
      type: [
        {
          type: Schema.Types.ObjectId,
          ref: "User",
        },
      ],
      default: [],
    },
  },
  { timestamps: true }
);

const boardUserActivitySchema = new Schema({
  board: {
    type: Schema.Types.ObjectId,
    ref: "Board",
    required: true,
  },
  user: {
    type: Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  lastOpenedAt: {
    type: Date,
    default: Date.now,
  },
});

export const BoardUserActivity = mongoose.model(
  "BoardUserActivity",
  boardUserActivitySchema
);

export const Board = mongoose.model("Board", boardSchema);
