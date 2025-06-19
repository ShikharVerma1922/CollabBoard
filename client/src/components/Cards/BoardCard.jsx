import React from "react";

const BoardCard = ({ title, description, onClick }) => {
  return (
    <div
      onClick={onClick}
      className="p-4 h-25 bg-[var(--surface)] rounded-xl shadow-sm hover:shadow-md transition duration-200 cursor-pointer"
    >
      <h2 className="text-lg font-semibold text-[var(--text)] mb-1 truncate">
        {title}
      </h2>
      <p className="text-sm text-gray-500 line-clamp-2 truncate text-wrap">
        {description}
      </p>
    </div>
  );
};

export default BoardCard;
