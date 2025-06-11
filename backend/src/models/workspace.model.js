import mongoose, { Schema } from "mongoose";

const workspaceSchema = new Schema(
  {
    title: {
      type: String,
      required: true,
    },
    admins: [
      {
        type: Schema.Types.ObjectId,
        ref: "User",
      },
    ],
    members: [
      {
        type: Schema.Types.ObjectId,
        ref: "User",
      },
    ],
    boards: [
      {
        type: Schema.Types.ObjectId,
        ref: "Board",
      },
    ],
  },
  {
    timestamps: true,
  }
);

export const Workspace = mongoose.model("Workspace", workspaceSchema);
