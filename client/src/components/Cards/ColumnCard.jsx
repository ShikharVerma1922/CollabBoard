import React from "react";
import { FiPlus } from "react-icons/fi";
import { adjustColor, isColorDark } from "../../Helper/colorHelper.js";
import { useWorkspace } from "../../context/WorkspaceContext.jsx";
import TaskCard from "./TaskCard.jsx";

const ColumnCard = ({
  title,
  onClick,
  description,
  visibility,
  color,
  columnId,
}) => {
  const isDark = isColorDark(color);
  const hoverBg = isDark ? adjustColor(color, 60) : adjustColor(color, -60);
  const { board } = useWorkspace();

  return (
    <div
      onClick={onClick}
      className={`py-2 px-2 rounded-xl shadow-sm hover:shadow-md transition duration-200 cursor-pointer border border-[var(--border)] w-70 max-h-fit ${
        isDark ? "text-white" : "text-black"
      }`}
      style={{ backgroundColor: color }}
    >
      <h2 className="text-md pl-2 font-semibold truncate self-start">
        {title}
      </h2>
      {board?.columns
        ?.find((col) => col._id === columnId)
        ?.tasks?.map((task) => (
          <TaskCard
            key={task._id}
            title={task.title}
            description={task.description}
          />
        ))}
      <div
        className="flex text-sm pl-2 py-1 gap-1 mt-2 rounded cursor-pointer transition"
        style={{ backgroundColor: "transparent" }}
        onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = hoverBg)}
        onMouseLeave={(e) =>
          (e.currentTarget.style.backgroundColor = "transparent")
        }
      >
        <FiPlus className="self-center" />
        <span>Add a card</span>
      </div>
    </div>
  );
};

export default ColumnCard;
