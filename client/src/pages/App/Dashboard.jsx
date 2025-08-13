import React, { useEffect, useState } from "react";
import BoardCard from "../../components/Cards/BoardCard.jsx";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { useWorkspaceList } from "../../context/WorkspaceListContext.jsx";
import { FaSuitcase, FaStar, FaClipboardList } from "react-icons/fa";
import { fetchWorkspaces } from "../../services/workspaceService";

//implement the toggle board favourite endpoint
// implement the get favouite and recent boards endpoint

const Dashboard = () => {
  const [recentBoards, setRecentBoards] = useState([]);
  const [favouriteBoards, setFavouriteBoards] = useState([]);
  const [loading, setLoading] = useState(true);
  const { workspaceList, setWorkspaceList } = useWorkspaceList();
  const navigate = useNavigate();

  useEffect(() => {
    const fetchRecentBoards = async () => {
      try {
        const res = await axios.get(
          `${import.meta.env.VITE_SERVER}/workspaces/boards/recent`,
          {
            withCredentials: true,
          }
        );

        setRecentBoards(res.data.data);
      } catch (err) {
        console.error("Failed to fetch recent boards", err);
      } finally {
        setLoading(false);
      }
    };

    fetchRecentBoards();
  }, []);

  useEffect(() => {
    const fetchFavouriteBoards = async () => {
      try {
        const res = await axios.get(
          `${import.meta.env.VITE_SERVER}/workspaces/boards/favourite`,
          {
            withCredentials: true,
          }
        );

        setFavouriteBoards(res.data.data);
      } catch (err) {
        console.error("Failed to fetch favourite boards", err);
      } finally {
        setLoading(false);
      }
    };

    fetchFavouriteBoards();
  }, []);

  // useEffect(() => {
  //   fetchWorkspaces({ setWorkspaceList });
  // }, []);

  return (
    <div className="p-0 sm:p-6 space-y-10 bg-[var(--background)] min-h-screen">
      {/* Header */}
      {/* <header className="text-center">
        <h1 className="text-3xl font-extrabold bg-gradient-to-r from-blue-500 to-purple-500 bg-clip-text text-transparent drop-shadow-sm">
          Your Dashboard
        </h1>
        <p className="text-[var(--muted-text)] mt-1">
          Quick access to your boards & workspaces
        </p>
      </header> */}

      {/* Recently Opened Boards */}
      <section className="bg-none sm:bg-[var(--accent-surface)] rounded-xl p-1 sm:p-5 shadow-sm">
        <h2 className="text-xl font-semibold mb-4 text-[var(--info)]">
          Recently Opened Boards
        </h2>
        {loading ? (
          <p className="text-gray-400">Loading...</p>
        ) : recentBoards.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-8 text-gray-500">
            <span className="text-4xl mb-2">
              <FaClipboardList />
            </span>
            <p>No recent boards found</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {recentBoards.map((board) => (
              <BoardCard
                key={board._id}
                title={board.title}
                description={board.description}
                workspaceTitle={board.workspace.title}
                onClick={() =>
                  navigate(
                    `/app/workspace/${board.workspace._id}/board/${board._id}`
                  )
                }
              />
            ))}
          </div>
        )}
      </section>

      {/* Favourite Boards */}
      <section className="bg-none sm:bg-[var(--accent-surface)] rounded-xl p-1 sm:p-5 shadow-sm">
        <h2 className="text-xl font-semibold mb-4 text-[var(--info)]">
          Favourite Boards
        </h2>
        {loading ? (
          <p className="text-gray-400">Loading...</p>
        ) : favouriteBoards.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-8 text-gray-500">
            <span className="text-4xl mb-2">
              <FaStar />
            </span>
            <p>No favourite boards yet</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {favouriteBoards.map((board) => (
              <BoardCard
                key={board._id}
                title={board.title}
                description={board.description}
                workspaceTitle={board.workspace.title}
                onClick={() =>
                  navigate(
                    `/app/workspace/${board.workspace._id}/board/${board._id}`
                  )
                }
              />
            ))}
          </div>
        )}
      </section>

      {/* Workspace access */}
      <section className="bg-none sm:bg-[var(--accent-surface)] rounded-xl p-1 sm:p-5 shadow-sm">
        <h2 className="text-xl font-semibold mb-4 text-[var(--info)]">
          Your Workspaces
        </h2>
        {loading ? (
          <p className="text-gray-400">Loading...</p>
        ) : workspaceList.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-8 text-gray-500">
            <span className="text-4xl mb-2">
              <FaSuitcase />
            </span>
            <p>No workspaces found!</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {workspaceList.map((workspace) => (
              <div
                key={workspace._id}
                className="p-4 bg-gradient-to-br from-[var(--surface)] to-[var(--surface-hover)] rounded-xl shadow-md hover:shadow-lg transform hover:-translate-y-1 transition-all duration-200 cursor-pointer border border-[var(--border)]"
                onClick={() => navigate(`/app/workspace/${workspace._id}`)}
              >
                <h1 className="text-lg font-bold text-[var(--text)] truncate">
                  {workspace.title}
                </h1>
                <div className="flex gap-3">
                  <span className="text-xs font-medium text-[var(--muted-text)] tracking-wide">
                    Members: {workspace.members.length}
                  </span>
                  <span className="text-xs font-medium text-[var(--muted-text)] tracking-wide">
                    Boards: {workspace.boards.length}
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>

      {/* Quick Actions
      <section className="bg-[var(--surface)] rounded-xl p-5 shadow-sm">
        <h2 className="text-xl font-semibold mb-4 text-[var(--text)]">
          Quick Actions
        </h2>
        <div className="flex gap-4 flex-wrap">
          <button className="flex items-center gap-2 px-5 py-3 rounded-full bg-gradient-to-r from-blue-500 to-indigo-500 text-white hover:opacity-90 transition">
            ➕ Create Board
          </button>
          <button className="flex items-center gap-2 px-5 py-3 rounded-full bg-gradient-to-r from-green-500 to-emerald-500 text-white hover:opacity-90 transition">
            🔗 Join Workspace
          </button>
        </div>
      </section> */}
    </div>
  );
};

export default Dashboard;
