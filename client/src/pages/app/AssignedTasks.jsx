import React, { useEffect, useState } from "react";
import axios from "axios";
import { format, differenceInDays } from "date-fns";
import { useNavigate } from "react-router-dom";
import { BsListTask } from "react-icons/bs";

export default function AssignedTasks() {
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchTasks = async () => {
      try {
        setLoading(true);
        const res = await axios.get(
          `${import.meta.env.VITE_SERVER}/workspaces/tasks/assigned`,
          {
            withCredentials: true,
          }
        );

        console.log(res.data.data);
        setTasks(res.data.data);
      } catch (err) {
        console.error("Failed to fetch assigned tasks", err);
      } finally {
        setLoading(false);
      }
    };
    fetchTasks();
  }, []);

  const getDueDateColor = (dueDate) => {
    if (!dueDate) return "";
    const days = differenceInDays(new Date(dueDate), new Date());
    if (days < 0) return "text-red-400"; // overdue
    if (days <= 7) return "text-orange-400"; // due soon
    return "text-green-400"; // plenty of time
  };

  return (
    <div className="p-6 bg-[var(--background)] min-h-screen">
      <h1 className="text-2xl font-bold mb-6 text-[var(--text)]">
        Assigned Tasks
      </h1>

      {loading ? (
        <p className="text-[var(--muted-text)]">Loading...</p>
      ) : tasks.length === 0 ? (
        <div className="flex flex-col items-center justify-center text-[var(--muted-text)] py-10">
          <span className="text-8xl mb-2">
            <BsListTask />
          </span>
          <p>No tasks assigned to you</p>
        </div>
      ) : (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {tasks.map((task) => {
            const days = task.dueDate
              ? differenceInDays(new Date(task.dueDate), new Date())
              : null;
            return (
              <div
                key={task._id}
                className="p-4 bg-gradient-to-br from-[var(--surface)] to-[var(--surface-hover)] rounded-xl shadow-md hover:shadow-lg transform hover:-translate-y-1 transition-all duration-200 cursor-pointer border border-[var(--border)]"
                onClick={() => {
                  navigate(
                    `/app/workspace/${task.workspaceInfo._id}/board/${task.boardInfo._id}?task=${task._id}`
                  );
                }}
              >
                <h2 className="text-lg font-semibold text-[var(--text)]">
                  {task.title}
                </h2>
                <p className="text-sm truncate line-clamp-1">
                  {task.description}
                </p>
                <p className="text-sm text-[var(--muted-text)] mt-2 mb-1">
                  Workspace:{" "}
                  <span className="text-[var(--text)] font-medium">
                    {task.workspaceInfo?.title || "N/A"}
                  </span>
                </p>
                <p className="text-sm text-[var(--muted-text)] mb-1">
                  Board:{" "}
                  <span className="text-[var(--text)] font-medium">
                    {task.boardInfo?.title || "N/A"}
                  </span>
                </p>
                <p className="text-sm text-[var(--muted-text)] mb-4">
                  Column:{" "}
                  <span className="text-[var(--text)] font-medium">
                    {task.columnInfo?.title || "N/A"}
                  </span>
                </p>

                {task.dueDate && (
                  <p
                    className={`text-sm font-medium ${getDueDateColor(
                      task.dueDate
                    )}`}
                  >
                    Due: {format(new Date(task.dueDate), "MMM dd, yyyy")}{" "}
                    {days < 0
                      ? `(Overdue by ${Math.abs(days)} days)`
                      : `(in ${days + 1} days)`}
                  </p>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
