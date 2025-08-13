import React from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { useWorkspace } from "../../context/WorkspaceContext.jsx";
import { FiBell, FiUser } from "react-icons/fi";
import { RiArrowDropDownFill } from "react-icons/ri";

import { useAuth } from "../../context/authContext.jsx";
import ThemeToggle from "../theme/ThemeToggle.jsx";

const Topbar = () => {
  const location = useLocation();
  const pathSegments = location.pathname.split("/").filter(Boolean);
  const isDashboard = pathSegments.length === 0;
  const { workspace, board } = useWorkspace();
  const { user, loadingUser } = useAuth();
  const navigate = useNavigate();

  let workspaceBC = "";
  let boardBC = "";
  if (pathSegments[1] === "workspace") {
    workspaceBC = workspace?.title;
    if (pathSegments[3] === "board" && pathSegments[4]) {
      boardBC = board?.title;
    }
  } else if (pathSegments[1] === "tasks") {
    workspaceBC = "Tasks";
  } else if (pathSegments[0] === "app") {
    workspaceBC = "Dashboard";
  }
  return (
    <nav className="w-full bg-[var(--accent-surface)] rounded-xl py-1.5 px-3 sticky top-0 z-10 shadow-md justify-between hidden sm:flex">
      <h2 className="text-xl sm:text-base font-medium text-[var(--text)] self-center">
        <span
          onClick={() =>
            workspaceBC !== "Tasks" &&
            workspaceBC !== "Dashboard" &&
            navigate(`/app/workspace/${workspace._id}`)
          }
          className="cursor-pointer"
        >
          {workspaceBC}
        </span>
        {`${boardBC ? " / " + boardBC : ""}`}
      </h2>
      <div className="flex gap-1">
        <ThemeToggle />
        <button
          data-tooltip-id="below"
          data-tooltip-content="Notifications"
          className="border-l-2 border-[var(--border)] px-3"
        >
          <FiBell className="text-xl cursor-pointer " />
        </button>
        <div
          data-tooltip-id="below"
          data-tooltip-content="Account"
          className="cursor-pointer self-center flex items-center gap-2"
        >
          <span
            className="bg-[var(--accent)] rounded-md p-2"
            style={{
              backgroundImage: `linear-gradient(135deg, var(--text),  var(--bg))`,
            }}
          >
            <FiUser className="text-2xl" />
          </span>
          <div className="flex flex-col gap-0">
            <span className="font-semibold text-[var(--text)] text-sm">
              {!loadingUser && user.username}
            </span>
            <span className="text-[var(--muted-text)] text-xs">
              {!loadingUser && user.fullName}
            </span>
          </div>
          <span className="text-2xl">
            <RiArrowDropDownFill />
          </span>
        </div>
      </div>
    </nav>
  );
};

export default Topbar;
