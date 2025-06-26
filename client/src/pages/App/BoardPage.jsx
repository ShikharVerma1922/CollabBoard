import React, { useEffect, useState, useCallback, use } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import { useWorkspace } from "../../context/WorkspaceContext.jsx";
import ColumnCard from "../../components/Cards/ColumnCard.jsx";
import { FiPlus } from "react-icons/fi";
import CreateColumnModal from "../../components/Modals/CreateColumnModal.jsx";
import socket from "../../services/socket.js";
import toast from "react-hot-toast";
import { useAuth } from "../../context/authContext.jsx";

const BoardPage = () => {
  const { workspaceId, boardId } = useParams();
  const { board, setBoard, setWorkspace } = useWorkspace();
  const [loading, setLoading] = useState(true);
  const [showCreateColumn, setShowCreateColumn] = useState(false);
  const { user } = useAuth();

  useEffect(() => {
    const fetchBoard = async () => {
      try {
        const res = await axios.get(
          `${
            import.meta.env.VITE_SERVER
          }/workspaces/${workspaceId}/boards/${boardId}`,
          {
            withCredentials: true,
          }
        );
        setBoard(res.data.data);
      } catch (error) {
        console.error("Error fetching board:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchBoard();
  }, [workspaceId, boardId]);

  useEffect(() => {
    const fetchWorkspace = async () => {
      try {
        const res = await axios.get(
          `${import.meta.env.VITE_SERVER}/workspaces/${workspaceId}`,
          {
            withCredentials: true,
          }
        );
        setWorkspace(res.data.data);
      } catch (error) {
        console.error("Error fetching board:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchWorkspace();
  }, [workspaceId, boardId]);

  // Memoize handlers to avoid duplicate listeners
  const handleBoardUpdate = useCallback(
    ({ task, createdBy }) => {
      if (task) {
        setBoard((prev) => ({
          ...prev,
          columns: prev.columns.map((col) =>
            col._id === task.column
              ? { ...col, tasks: [...col.tasks, task] }
              : col
          ),
        }));
        const col = board?.columns.find((col) => col._id === task.column);
        if (col) {
          console.log(col.title);
          toast.success(
            <span>
              <strong>{createdBy}</strong> added a task to column{" "}
              <strong>{col.title}</strong>
            </span>,
            { duration: 6000 }
          );
        }
      }
    },
    [setBoard]
  );

  const handleTaskStatusUpdate = useCallback(
    ({ task, taskCompleted, updatedBy }) => {
      if (task) {
        setBoard((prev) => ({
          ...prev,
          columns: prev.columns.map((col) =>
            col._id === task.column
              ? {
                  ...col,
                  tasks: col.tasks.map((t) => (t._id === task._id ? task : t)),
                }
              : col
          ),
        }));
        toast.success(
          <span>
            Task <strong>{task.title}</strong> marked{" "}
            <strong
              className={taskCompleted ? "text-green-600" : "text-red-600"}
            >
              {taskCompleted ? "done" : "not done"}
            </strong>{" "}
            by <strong className="text-purple-600">{updatedBy}</strong>
          </span>,
          { duration: 6000, icon: "" }
        );
      }
    },
    [setBoard]
  );

  useEffect(() => {
    if (board?._id) {
      console.log("Emitted join-board for", board._id);
      socket.emit("join-board", board._id); // join socket room
    }

    socket.on("task-created", handleBoardUpdate);
    socket.on("task-status-updated", handleTaskStatusUpdate);

    return () => {
      if (board?._id) {
        socket.emit("leave-board", board._id); // cleanup
      }
      socket.off("task-created", handleBoardUpdate);
      socket.off("task-status-updated", handleTaskStatusUpdate);
    };
  }, [board?._id, handleBoardUpdate, handleTaskStatusUpdate]);

  if (loading) return <p className="p-4 text-[var(--text)]">Loading...</p>;
  if (!board) return <p className="p-4 text-[var(--text)]">Board not found</p>;

  return (
    <div className="text-[var(--text)] p-4 overflow-x-auto min-h-screen">
      <h1 className="text-2xl font-bold mb-2">{board.title}</h1>
      <p className="mb-4 text-sm text-gray-400">{board.description}</p>

      <div className="flex gap-4 overflow-x-auto w-full pb-2 flex-nowrap scroll-smooth scrollbar-thin scrollbar-thumb-[var(--border)] min-w-fit">
        {/* Placeholder for columns */}
        {board.columns.map((column) => (
          <ColumnCard
            key={column._id}
            title={column.title}
            color={column.color}
            description={column.description}
            visibility={column.visibility}
            columnId={column._id}
          />
        ))}
        <div>
          {!showCreateColumn ? (
            <div
              onClick={() => setShowCreateColumn(true)}
              className="p-4 rounded-xl shadow-sm hover:shadow-md transition duration-200 cursor-pointer border border-[var(--border)] min-w-70 h-15 bg-[var(--surface)] hover:bg-[var(--accent-surface)] flex gap-3 text-[var(--muted-text)]"
            >
              <span className="self-center text-xl">
                <FiPlus />
              </span>
              <span>Add another list</span>
            </div>
          ) : (
            <CreateColumnModal setShowModal={setShowCreateColumn} />
          )}
        </div>
      </div>
    </div>
  );
};

export default BoardPage;
