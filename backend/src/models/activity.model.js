import mongoose, { Schema } from "mongoose";

const activitySchema = new Schema(
  {
    actor: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    workspace: {
      type: Schema.Types.ObjectId,
      ref: "Workspace",
      required: true,
    },
    board: {
      type: Schema.Types.ObjectId,
      ref: "Board",
      default: null,
    },
    type: {
      type: String,
      enum: [],
      required: true,
    },
    target: {
      type: Schema.Types.ObjectId,
      refPath: "targetModel",
    },
    targetModel: {
      type: String,
      enum: [
        "User",
        "Workspace",
        "Board",
        "Column",
        "Task",
        "Message",
        "Comment",
      ],
    },
    message: {
      type: String,
      required: true,
    },
  },
  { timestamps: true }
);

export const Activity = mongoose.model("Activity", activitySchema);
