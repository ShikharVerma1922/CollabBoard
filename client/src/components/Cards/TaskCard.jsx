import React from "react";

const TaskCard = ({ title, description, onClick }) => {
  return (
    <div
      onClick={onClick}
      className="p-3 bg-[var(--surface)] rounded-lg shadow-sm hover:shadow-md transition border-4 border-[var(--surface)] cursor-pointer mb-1.5 hover:border-[var(--accent)]"
    >
      <h3 className="text-[var(--text)] font-semibold text-sm truncate mb-1">
        {title}
      </h3>
      {description && (
        <p className="text-xs text-gray-500 line-clamp-2">{description}</p>
      )}
    </div>
  );
};

export default TaskCard;
