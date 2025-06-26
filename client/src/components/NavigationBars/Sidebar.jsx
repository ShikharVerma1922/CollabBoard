import { useEffect, useState } from "react";
import WorkspaceCard from "../Cards/WorkspaceCard.jsx";
import { fetchWorkspaces } from "../../services/workspaceService.js";
import { useLocation, NavLink, useNavigate } from "react-router-dom";

import {
  HiSearch,
  HiHome,
  HiCog,
  HiLogout,
  HiUsers,
  HiViewBoards,
  HiPlus,
} from "react-icons/hi";
import { RiArrowDropDownLine } from "react-icons/ri";
import {
  TbLayoutSidebarLeftCollapse,
  TbLayoutSidebarLeftExpand,
} from "react-icons/tb";
import { getRandomColor } from "../../Helper/iconHelper.js";
import CreateWorkspaceModel from "../Modals/CreateWorkspaceModal.jsx";
import { useWorkspaceList } from "../../context/WorkspaceListContext.jsx";
import { useAuth } from "../../context/authContext.jsx";

const SideBar = () => {
  const { workspaceList, setWorkspaceList } = useWorkspaceList();
  const [expandedWorkspace, setExpandedWorkspace] = useState([]);
  const [isSBCollapsed, setIsSBCollapsed] = useState(false);
  const [showModel, setShowModal] = useState(false);
  const { logout } = useAuth();

  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    fetchWorkspaces({ setWorkspaceList });
  }, []);
  return (
    <aside
      className={`h-screen flex-none py-2 bg-[var(--accent-surface)] select-none transition-all duration-300 w-14 pl-2 pr-2 overflow-x-hidden overflow-y-hidden ${
        isSBCollapsed ? "sm:w-14 sm:pl-2 sm:pr-2" : "sm:w-56 sm:pl-4 sm:pr-0"
      }`}
    >
      <div
        className={`flex justify-around sm:justify-between self-center pt-3 w-full ${
          isSBCollapsed ? "flex-col gap-6" : "mb-4"
        }`}
      >
        <div
          className={`flex items-center gap-1 justify-around cursor-pointer sm:${
            isSBCollapsed ? "justify-around" : "justify-start"
          }`}
          onClick={() => {
            navigate("/app");
          }}
        >
          <img
            src="/logo-accent-dark.svg"
            alt="CollabBoard logo"
            className="h-7 hidden dark:block"
          />
          <img
            src="/logo-accent.svg"
            alt="CollabBoard logo"
            className="h-7 block dark:hidden"
          />
          {!isSBCollapsed && (
            <h1
              className="text-[18px] hidden sm:block font-[Urbanist] py-1 bg-clip-text text-transparent"
              style={{
                backgroundImage:
                  "linear-gradient(135deg, var(--accent), var(--text))",
              }}
            >
              CollabBoard
            </h1>
          )}
        </div>
        <span
          className="text-2xl text-[var(--text)] p-2 hidden sm:block self-center hover:text-[var(--accent)] cursor-pointer"
          onClick={() => setIsSBCollapsed((prev) => !prev)}
        >
          {isSBCollapsed ? (
            <TbLayoutSidebarLeftExpand />
          ) : (
            <TbLayoutSidebarLeftCollapse />
          )}
        </span>
      </div>

      {/* Main sidebar content */}
      <div className=" pb-10 pt-2 text-[var(--text)] h-full flex flex-col justify-between align-middle mt-6 sm:mt-0">
        <div className="flex flex-col align-middle justify-center gap-2">
          <h2
            className={`flex items-middle gap-2 cursor-pointer hover:text-[var(--accent)] justify-around ${
              isSBCollapsed ? "sm:justify-around" : "sm:justify-start"
            }`}
          >
            <HiSearch className="text-xl self-center" />
            {!isSBCollapsed && <span className="hidden sm:block">Search</span>}
          </h2>
          <NavLink
            to="/app"
            end
            className={({ isActive }) =>
              `flex items-middle gap-2 cursor-pointer justify-around sm:${
                isSBCollapsed ? "justify-around" : "justify-start"
              } ${
                isActive
                  ? "text-[var(--accent)] font-bold"
                  : "hover:text-[var(--accent)]"
              }`
            }
            onClick={() => setExpandedWorkspace([])}
          >
            <HiHome className="text-xl" />
            {!isSBCollapsed && <span className="hidden sm:block">Home</span>}
          </NavLink>
          <hr
            className={`mt-2 border-[var(--border)] mr-0  sm:${
              isSBCollapsed ? "mr-0" : "mr-3"
            }`}
          />
          <div>
            {!isSBCollapsed ? (
              <div className="flex justify-between sm:pr-4 sm:pl-1 sm:rounded-md sm:py-2 group sm:hover:bg-[var(--bg)]">
                <span className="text-[13px] hidden sm:block font-bold">
                  Workspaces
                </span>
                <span
                  className="text-xl sm:hidden flex justify-center border rounded ml-2 my-2 w-6 h-6 font-bold sm:group-hover:block hover:text-[var(--accent)] cursor-pointer sm:ml:0 sm:mb-0 sm:mt-0 sm:border-none sm:pr-4 sm:h-4"
                  onClick={() => setShowModal(true)}
                >
                  <HiPlus className="sm:self-center" />
                </span>
              </div>
            ) : (
              <span
                className="flex justify-center border rounded ml-2 mb-2 w-6 h-6 hover:text-[var(--accent)] cursor-pointer"
                onClick={() => setShowModal(true)}
              >
                <HiPlus className="self-center" />
              </span>
            )}
            <div className="mt-1 max-h-[60vh] overflow-y-auto">
              {workspaceList.map((workspace) => {
                const isExpanded = expandedWorkspace.includes(workspace._id);
                return (
                  <div
                    key={workspace._id}
                    className={`mb-2 justify-center align-middle overflow-x-hidden ${
                      isExpanded
                        ? `py-2 p-1 rounded bg-[var(--bg)] shadow-md sm:${
                            isSBCollapsed ? "rounded" : "rounded-r-none"
                          }`
                        : ""
                    } `}
                  >
                    {/* Workspace Title */}
                    <h2
                      className={`flex items-start justify-between w-full cursor-pointer hover:text-[var(--accent)] pr-1 pl-1 sm:${
                        isSBCollapsed ? "justify-around" : "justify-between"
                      } ${isExpanded ? "font-semibold" : ""}`}
                      onClick={() => setExpandedWorkspace(workspace._id)}
                    >
                      <div
                        className={`flex gap-2 items-center min-w-0 ${
                          isExpanded
                            ? "hover:text-[var(--text)] cursor-default"
                            : "hover:text-[var(-accent)]"
                        }`}
                      >
                        <div
                          className="min-w-6 h-6 rounded text-black flex items-center justify-center text-xs font-semibold"
                          style={{
                            backgroundImage: `linear-gradient(135deg, ${getRandomColor(
                              workspace._id
                            )}, var(--bg))`,
                          }}
                        >
                          {workspace.title.slice(0, 1).toUpperCase()}
                        </div>
                        {!isSBCollapsed && (
                          <span className="hidden sm:block self-center truncate overflow-hidden whitespace-nowrap">
                            {workspace.title}
                          </span>
                        )}
                      </div>
                      {!isSBCollapsed && (
                        <span className="hidden sm:block self-center">
                          {isExpanded ? (
                            ""
                          ) : (
                            <RiArrowDropDownLine className="text-2xl" />
                          )}
                        </span>
                      )}
                    </h2>

                    {/* Board and Members */}
                    {isExpanded && (
                      <div
                        className={
                          "mt-3 flex flex-col justify-center ml-0 gap-2 " +
                          (isSBCollapsed ? "sm:ml-0" : "sm:ml-7")
                        }
                      >
                        <NavLink
                          to={`/app/workspace/${workspace._id}`}
                          end
                          className={({ isActive }) =>
                            `flex justify-around gap-2 cursor-pointer sm:${
                              isSBCollapsed ? "justify-around" : "justify-start"
                            } ${
                              isActive
                                ? "text-[var(--accent)] font-semibold"
                                : "hover:text-[var(--accent)]"
                            }`
                          }
                        >
                          <HiViewBoards className="text-lg self-center" />
                          {!isSBCollapsed && (
                            <span className="hidden sm:block self-center">
                              Boards
                            </span>
                          )}
                        </NavLink>
                        <NavLink
                          to={`/app/workspace/${workspace._id}/members`}
                          end
                          className={({ isActive }) =>
                            `flex justify-around gap-2 cursor-pointer sm:${
                              isSBCollapsed ? "justify-around" : "justify-start"
                            } ${
                              isActive
                                ? "text-[var(--accent)] font-semibold"
                                : "hover:text-[var(--accent)]"
                            }`
                          }
                        >
                          <HiUsers className="text-lg self-center" />
                          {!isSBCollapsed && (
                            <span className="hidden sm:block">Members</span>
                          )}
                        </NavLink>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        </div>
        <div
          className={`flex flex-col gap-2 ${
            isSBCollapsed ? "mb-6 sm:mb-18" : "mb-8"
          }`}
        >
          <NavLink
            to="/app/settings"
            className={({ isActive }) =>
              `flex justify-around gap-2 cursor-pointer sm:${
                isSBCollapsed ? "justify-around" : "justify-start"
              } ${
                isActive
                  ? "text-[var(--accent)] font-bold"
                  : "hover:text-[var(--accent)]"
              }`
            }
          >
            <HiCog className="text-xl" />
            {!isSBCollapsed && (
              <span className="hidden sm:block">Settings</span>
            )}
          </NavLink>
          <h3
            className={`flex justify-around gap-2 hover:text-red-400 cursor-pointer sm:${
              isSBCollapsed ? "justify-around" : "justify-start"
            }`}
            onClick={logout}
          >
            <HiLogout className="text-xl" />
            {!isSBCollapsed && <span className="hidden sm:block">Logout</span>}
          </h3>
        </div>
      </div>
      {showModel && <CreateWorkspaceModel setShowModal={setShowModal} />}
    </aside>
  );
};

export default SideBar;
