import mongoose, { Schema } from "mongoose";

const columnsSchema = new Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true,
    },
    description: {
      type: String,
    },
    color: {
      type: String,
      default: "#D3D3D3",
    },
    visibility: {
      type: String,
      enum: ["private", "public"],
      default: "public",
      required: true,
    },
    board: {
      type: Schema.Types.ObjectId,
      ref: "Board",
      required: true,
    },
    createdBy: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    tasks: [
      {
        type: Schema.Types.ObjectId,
        ref: "Task",
      },
    ],
  },
  { timestamps: true }
);

export const Column = mongoose.model("Column", columnsSchema);
