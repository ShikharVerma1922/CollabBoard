import React, { useEffect, useState, useCallback } from "react";
import { useParams, useSearchParams } from "react-router-dom";
import axios from "axios";
import { useWorkspace } from "../../context/WorkspaceContext.jsx";
import ColumnCard from "../../components/Cards/ColumnCard.jsx";
import { FiPlus } from "react-icons/fi";
import CreateColumnModal from "../../components/Modals/CreateColumnModal.jsx";
import socket from "../../services/socket.js";
import toast from "react-hot-toast";
import { useAuth } from "../../context/authContext.jsx";
import { DragDropContext, Droppable, Draggable } from "@hello-pangea/dnd";
import { FaRegStar, FaStar } from "react-icons/fa";

const BoardPage = () => {
  const { workspaceId, boardId } = useParams();
  const { board, setBoard, setWorkspace } = useWorkspace();
  const [loading, setLoading] = useState(true);
  const [showCreateColumn, setShowCreateColumn] = useState(false);
  const { user } = useAuth();
  const [isFavourite, setIsFavourite] = useState(false);
  const [searchParams] = useSearchParams();
  const highlightTaskId = searchParams.get("task");

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
        console.log(res.data.data);
        setIsFavourite(res.data.data.favourite);
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

  const handleToggleFavourite = async () => {
    try {
      const res = await axios.patch(
        `${
          import.meta.env.VITE_SERVER
        }/workspaces/${workspaceId}/boards/${boardId}/toggle-favourite`,
        {},
        {
          withCredentials: true,
        }
      );

      setIsFavourite(res.data.data.favourite);
    } catch (error) {
      console.error("Error fetching board:", error);
    }
  };

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
    <div className="text-[var(--text)] p-4 overflow-x-auto min-h-screen h-full">
      <div className="flex items-center gap-3 mb-2">
        <h1 className="text-2xl font-bold">{board.title}</h1>
        <span
          className="cursor-pointer text-xl"
          onClick={handleToggleFavourite}
        >
          {isFavourite ? (
            <FaStar
              className="dark:text-yellow-300 text-yellow-500"
              data-tooltip-id="my-tooltip"
              data-tooltip-content="Unstar"
              data-tooltip-place="top"
            />
          ) : (
            <FaRegStar
              data-tooltip-id="my-tooltip"
              data-tooltip-content="Star"
              data-tooltip-place="top"
            />
          )}
        </span>
      </div>
      <p className="mb-4 text-sm text-gray-400">{board.description}</p>

      <DragDropContext
        onDragEnd={async (result) => {
          const { source, destination, draggableId, type } = result;

          if (!destination) return;

          if (type === "COLUMN") {
            const updatedColumns = Array.from(board.columns);
            const [moved] = updatedColumns.splice(source.index, 1);
            updatedColumns.splice(destination.index, 0, moved);

            setBoard({ ...board, columns: updatedColumns });

            try {
              await axios.patch("/api/reorder-columns", {
                boardId: board._id,
                columnOrder: updatedColumns.map((col) => col._id),
              });
            } catch (err) {
              console.error("Column reorder failed", err);
              toast.error("Failed to reorder columns");
            }

            return;
          }

          const sourceCol = board.columns.find(
            (c) => c._id === source.droppableId
          );
          const destCol = board.columns.find(
            (c) => c._id === destination.droppableId
          );
          if (!sourceCol || !destCol) return;

          const sourceTasks = Array.from(sourceCol.tasks);
          const [movedTask] = sourceTasks.splice(source.index, 1);

          if (sourceCol._id === destCol._id) {
            sourceTasks.splice(destination.index, 0, movedTask);
            const updatedColumns = board.columns.map((col) =>
              col._id === sourceCol._id ? { ...col, tasks: sourceTasks } : col
            );

            setBoard({ ...board, columns: updatedColumns });

            try {
              await axios.post(
                `${
                  import.meta.env.VITE_SERVER
                }/workspaces/${workspaceId}/boards/${boardId}/columns/${
                  sourceCol._id
                }/tasks/reorder`,
                {
                  taskOrder: sourceTasks.map((t) => t._id),
                },
                { withCredentials: true }
              );
            } catch (err) {
              console.log(err.response.data.stack);
              console.log(err.response.data);
              toast.error("Failed to reorder tasks");
            }
          } else {
            const destTasks = Array.from(destCol.tasks);
            destTasks.splice(destination.index, 0, movedTask);

            const updatedColumns = board.columns.map((col) => {
              if (col._id === sourceCol._id) {
                return { ...col, tasks: sourceTasks };
              } else if (col._id === destCol._id) {
                return { ...col, tasks: destTasks };
              }
              return col;
            });

            setBoard({ ...board, columns: updatedColumns });

            try {
              await axios.post(
                `${
                  import.meta.env.VITE_SERVER
                }/workspaces/${workspaceId}/boards/${boardId}/columns/${
                  sourceCol._id
                }/tasks/${draggableId}/move`,
                {
                  columnId: destCol._id,
                  position: destination.index,
                },
                { withCredentials: true }
              );
            } catch (err) {
              console.log(err);
              toast.error("Failed to move task");
            }
          }
        }}
      >
        <Droppable
          droppableId="board-columns"
          direction="horizontal"
          type="COLUMN"
        >
          {(provided) => (
            <div
              className="flex gap-4 overflow-x-auto w-full pb-2 flex-nowrap scroll-smooth scrollbar-thin scrollbar-thumb-[var(--border)] min-w-fit h-full"
              {...provided.droppableProps}
              ref={provided.innerRef}
            >
              {board?.columns?.map((column, index) => (
                <Draggable
                  draggableId={column._id}
                  index={index}
                  key={column._id}
                >
                  {(provided) => (
                    <div
                      {...provided.draggableProps}
                      {...provided.dragHandleProps}
                      ref={provided.innerRef}
                    >
                      <Droppable droppableId={column._id} type="TASK">
                        {(dropProvided, dropSnapshot) => (
                          <div
                            ref={dropProvided.innerRef}
                            {...dropProvided.droppableProps}
                          >
                            <ColumnCard
                              title={column.title}
                              color={column.color}
                              description={column.description}
                              visibility={column.visibility}
                              columnId={column._id}
                              tasks={column.tasks}
                              isDraggingOver={dropSnapshot.isDraggingOver}
                              highlightTaskId={highlightTaskId}
                            />
                            {dropProvided.placeholder}
                          </div>
                        )}
                      </Droppable>
                    </div>
                  )}
                </Draggable>
              ))}
              {provided.placeholder}
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
          )}
        </Droppable>
      </DragDropContext>
    </div>
  );
};

export default BoardPage;
