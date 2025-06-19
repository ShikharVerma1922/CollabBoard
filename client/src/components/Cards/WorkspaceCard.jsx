import React, { useEffect } from "react";
import axios from "axios";

const WorkspaceCard = ({
  title,
  description = "This is a dummy description for this Workspace",
  memberCount,
}) => {
  return (
    <div className="p-4 border rounded-2xl shadow-sm hover:shadow-md transition duration-200 bg-[var(--surface)] border-[var(--border)] cursor-pointer">
      <h2 className="text-lg font-semibold text-[var(--text)] mb-1">{title}</h2>
      <p className="text-sm text-[var(--muted-text)] mb-2">{description}</p>
      {memberCount !== undefined && (
        <p className="text-xs text-gray-400">
          {memberCount} member{memberCount !== 1 ? "s" : ""}
        </p>
      )}
    </div>
  );
};

export default WorkspaceCard;
