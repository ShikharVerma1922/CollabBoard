import React from "react";
import { format } from "date-fns";
import {
  FaUser,
  FaCalendarAlt,
  FaTasks,
  FaClipboardList,
} from "react-icons/fa";

const ShowTaskDetailModal = ({ isOpen, onClose, task }) => {
  if (!isOpen || !task) return null;

  const formatDate = (date) => {
    if (!date) return "No due date";
    return format(new Date(date), "PPP p");
  };

  return (
    <div
      className="fixed inset-0 bg-black/50 flex items-center justify-center z-50"
      onClick={onClose}
    >
      <div
        className="bg-gray-900 text-white w-full max-w-lg rounded-lg shadow-lg p-6 relative animate-fadeIn"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-3 right-3 text-gray-400 hover:text-white text-2xl"
        >
          &times;
        </button>

        {/* Title */}
        <h2 className="text-2xl font-bold mb-4">{task.title}</h2>

        {/* Description */}
        {task.description && (
          <p className="flex items-center gap-2 mb-3 text-gray-300">
            <FaClipboardList /> {task.description}
          </p>
        )}

        {/* Column */}
        <p className="flex items-center gap-2 mb-2">
          <FaTasks /> Column: <strong>{task.column?.title || "Unknown"}</strong>
        </p>

        {/* Assigned To */}
        <p className="flex items-center gap-2 mb-2">
          <FaUser /> Assigned To:{" "}
          <strong>{task.assignedTo?.fullName || "Not assigned"}</strong>
        </p>

        {/* Due Date */}
        <p className="flex items-center gap-2 mb-2">
          <FaCalendarAlt /> Due Date:{" "}
          <strong>{formatDate(task.dueDate)}</strong>
        </p>

        {/* Created By */}
        <p className="flex items-center gap-2 mb-2">
          <FaUser /> Created By:{" "}
          <strong>{task.createdBy?.fullName || "Unknown"}</strong>
        </p>

        {/* Status */}
        <p className="mb-2">
          Status:{" "}
          {task.completed ? (
            <span className="text-green-400">✅ Completed</span>
          ) : (
            <span className="text-yellow-400">⏳ Pending</span>
          )}
        </p>

        {/* Timestamps */}
        <p className="text-sm text-gray-400">
          Created At: {formatDate(task.createdAt)}
        </p>
        <p className="text-sm text-gray-400">
          Last Updated: {formatDate(task.updatedAt)}
        </p>
      </div>
    </div>
  );
};

export default ShowTaskDetailModal;
