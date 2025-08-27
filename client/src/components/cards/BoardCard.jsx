import React from "react";

const BoardCard = ({ title, description, onClick, workspaceTitle }) => {
  return (
    <div
      onClick={onClick}
      className="p-4 bg-gradient-to-br from-[var(--surface)] to-[var(--surface-hover)] rounded-xl shadow-md hover:shadow-lg transform hover:-translate-y-1 transition-all duration-200 cursor-pointer border border-[var(--border)]"
    >
      {/* Header */}
      <div className="flex flex-col gap-1 mb-2">
        <h2 className="text-lg font-bold text-[var(--text)] truncate">
          {title}
        </h2>
        {workspaceTitle && (
          <h3 className="text-xs font-medium text-[var(--muted-text)] tracking-wide uppercase">
            {workspaceTitle}
          </h3>
        )}
      </div>

      {/* Divider */}
      <div className="h-[1px] bg-[var(--border)] my-2" />

      {/* Description */}
      <p className="text-sm text-[var(--muted-text)] leading-relaxed line-clamp-2">
        {description}
      </p>
    </div>
  );
};

export default BoardCard;
