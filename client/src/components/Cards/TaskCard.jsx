import React, { useEffect, useState } from "react";
import { ImCheckmark } from "react-icons/im";
import { useWorkspace } from "../../context/WorkspaceContext.jsx";
import axios from "axios";
import toast from "react-hot-toast";
import { useAuth } from "../../context/authContext.jsx";

const TaskCard = ({
  title,
  description,
  onClick,
  columnId,
  taskId,
  status,
  createdBy,
  assignedTo,
  dueDate,
  completed,
}) => {
  const { board, setBoard, workspace, setWorkspace } = useWorkspace();
  const { user } = useAuth();

  const [loading, setLoading] = useState(false);

  const showStatusUpdateButton =
    user._id === createdBy || user._id === assignedTo;

  async function updateTaskStatus() {
    try {
      const res = await axios.patch(
        `${import.meta.env.VITE_SERVER}/workspaces/${workspace._id}/boards/${
          board._id
        }/columns/${columnId}/tasks/${taskId}/status`,
        {
          taskCompleted: !status,
        },
        {
          withCredentials: true,
        }
      );
      console.log(res.data.data);
      setBoard((prev) => ({
        ...prev,
        columns: prev.columns.map((col) =>
          col._id === columnId
            ? {
                ...col,
                tasks: col.tasks.map((t) =>
                  t._id === taskId ? res.data.data : t
                ),
              }
            : col
        ),
      }));
    } catch (err) {
      console.log("Error in update task status: ", err);
      toast.error(err?.response?.data?.message || "Failed to update task.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div
      onClick={!loading ? onClick : undefined}
      className={`group p-3 bg-[var(--surface)] rounded-lg shadow-sm hover:shadow-md transition border-4 border-[var(--surface)] mb-1.5 hover:border-[var(--accent)] ${
        loading ? "cursor-progress opacity-70" : "cursor-pointer"
      }`}
    >
      <div className="flex gap-2 items-start">
        {showStatusUpdateButton ? (
          <div
            className={`transition-[opacity,width] duration-300 ease-in-out  group-hover:opacity-100 group-hover:w-4 overflow-hidden ${
              status ? "" : "w-0 opacity-0"
            }`}
          >
            <div
              onClick={(e) => {
                e.stopPropagation();
                if (!loading) updateTaskStatus();
              }}
              className={`w-4 h-4 rounded-full border-2 self-start mt-1 transition-opacity duration-300 flex justify-center items-center p-[2px] ${
                status
                  ? "dark:bg-green-400 dark:border-green-400 bg-green-600 border-green-600"
                  : "border-gray-400"
              } ${loading ? "cursor-progress opacity-50" : ""}`}
            >
              {status && <ImCheckmark className="text-[var(--surface)]" />}
            </div>
          </div>
        ) : (
          <div onClick={() => toast.error("You cannot update this task")}>
            {status && (
              <div className="w-4 h-4 rounded-full border-2 self-start mt-1 transition-opacity duration-300 flex justify-center items-center p-[2px] dark:bg-green-400 dark:border-green-400 bg-green-600 border-green-600">
                <ImCheckmark className="text-[var(--surface)]" />
              </div>
            )}
          </div>
        )}

        <div
          className={`transition-all duration-300 ease-in-out ${
            status || true ? "ml-0" : "ml-0"
          }`}
        >
          <h3 className="text-[var(--text)] font-semibold text-sm truncate max-w-50 mb-1">
            {title}
          </h3>
          {/* {description && (
            <p className="text-xs text-gray-500 line-clamp-2 text-wrap truncate max-w-50 mb-2">
              {description}
            </p>
          )} */}
        </div>
      </div>
      {/* Due in */}
      <div className="flex justify-between items-start">
        {!completed &&
          dueDate &&
          showStatusUpdateButton &&
          (() => {
            const now = new Date();
            const due = new Date(dueDate);
            const diffDays = Math.ceil(
              (due.setHours(0, 0, 0, 0) - now.setHours(0, 0, 0, 0)) /
                (1000 * 60 * 60 * 24)
            );

            return (
              <p
                className={`text-xs w-full ml-3 ${
                  diffDays < 0
                    ? "text-[var(--error)]"
                    : diffDays <= 7
                    ? "text-[var(--warning)]"
                    : "text-[var(--muted-text)]"
                }`}
              >
                {diffDays < 0 ? `Overdue by ` : `Due in `}
                <strong>{Math.abs(diffDays)}</strong> day
                {Math.abs(diffDays) > 1 ? "s" : ""}
              </p>
            );
          })()}
        <div className="flex flex-col items-end w-full">
          {user._id === createdBy && (
            <p className="text-xs text-[var(--info)]">Added</p>
          )}
          {user._id === assignedTo && (
            <p className="text-xs text-[var(--success)] max-w-full">Assigned</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default TaskCard;
