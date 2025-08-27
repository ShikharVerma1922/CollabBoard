import React, { useState } from "react";
import { FiPlus } from "react-icons/fi";
import { adjustColor, isColorDark } from "../../helper/colorHelper.js";
import { useWorkspace } from "../../context/WorkspaceContext.jsx";
import TaskCard from "./TaskCard.jsx";
import CreateTaskModal from "../modals/CreateTaskModal.jsx";

const ColumnCard = ({
  title,
  onClick,
  description,
  visibility,
  color,
  columnId,
  tasks,
  isDraggingOver,
  highlightTaskId,
}) => {
  const isDark = isColorDark(color);
  const hoverBg = isDark ? adjustColor(color, 60) : adjustColor(color, -60);
  const { board } = useWorkspace();
  const [showCreateTask, setShowCreateTask] = useState(false);
  return (
    <div
      onClick={onClick}
      className={`py-2 px-2 rounded-xl shadow-sm hover:shadow-md transition duration-200 cursor-pointer border border-[var(--border)] w-70  ${
        isDark ? "text-white" : "text-black"
      } ${
        isDraggingOver
          ? " h-[calc(100%+100px)] max-h-full border-red-100 border-4"
          : "max-h-fit"
      }`}
      style={{ backgroundColor: color }}
    >
      <h2 className="text-md pl-2 font-semibold truncate self-start mb-2">
        {title}
      </h2>
      {tasks?.map((task, index) => (
        <TaskCard
          key={task._id}
          title={task.title}
          description={task.description}
          columnId={task.column}
          taskId={task._id}
          status={task.completed}
          createdBy={task.createdBy}
          assignedTo={task.assignedTo}
          completed={task.completed}
          dueDate={task.dueDate}
          index={index}
          highlight={highlightTaskId === task._id}
        />
      ))}
      {!showCreateTask && (
        <div
          className="flex text-sm pl-2 py-1 gap-1 mt-2 rounded cursor-pointer transition"
          style={{ backgroundColor: "transparent" }}
          onMouseEnter={(e) =>
            (e.currentTarget.style.backgroundColor = hoverBg)
          }
          onMouseLeave={(e) =>
            (e.currentTarget.style.backgroundColor = "transparent")
          }
          onClick={() => setShowCreateTask(true)}
        >
          <FiPlus className="self-center" />
          <span>Add a card</span>
        </div>
      )}
      <div>
        {showCreateTask && (
          <CreateTaskModal
            setShowModal={setShowCreateTask}
            columnId={columnId}
          />
        )}
      </div>
    </div>
  );
};

export default ColumnCard;
