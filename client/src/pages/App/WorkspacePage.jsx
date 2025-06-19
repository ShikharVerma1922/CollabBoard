import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import { useWorkspace } from "../../context/WorkspaceContext.jsx";
import BoardCard from "../../components/Cards/BoardCard.jsx";
import { useNavigate } from "react-router-dom";
import { getRandomColor } from "../../Helper/iconHelper.js";
import CreateBoardModel from "../../components/Modals/CreateBoardModal.jsx";
import { FilePen } from "lucide-react";
import { TbFilePencil } from "react-icons/tb";
import { FiEdit, FiEdit2 } from "react-icons/fi";
import UpdateWorkspaceModal from "../../components/Modals/UpdateWorkspaceModal.jsx";

const WorkspacePage = () => {
  const { id } = useParams(); // get workspace ID from URL
  const { workspace, setWorkspace } = useWorkspace();
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  const [showModal, setShowModal] = useState(false);
  const [showWorkspaceModal, setShowWorkspaceModal] = useState(false);

  useEffect(() => {
    const fetchWorkspace = async () => {
      try {
        const res = await axios.get(
          `${import.meta.env.VITE_SERVER}/workspaces/${id}`,
          {
            withCredentials: true,
          }
        );
        setWorkspace(res.data.data);
      } catch (err) {
        console.error("Error fetching workspace:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchWorkspace();
  }, [id]);

  if (loading) return <p>Loading...</p>;
  if (!workspace) return <p>Workspace not found</p>;

  function handleCreateBoard() {
    setShowModal(true);
  }

  return (
    <div className="text-[var(--text)] p-4">
      <div className="flex flex-col gap-2">
        <div className="flex justify-start gap-2">
          <div
            className="w-15 h-15 rounded text-black flex items-center justify-center text-3xl font-semibold"
            style={{
              backgroundImage: `linear-gradient(135deg, ${getRandomColor(
                workspace._id
              )}, #ffffff20)`,
            }}
          >
            {workspace.title.slice(0, 1).toUpperCase()}
          </div>
          <div className="flex gap-2">
            <div className="self-baseline">
              <h1 className="text-2xl font-semibold">{workspace.title}</h1>
            </div>
            <span
              className="rounded p-2 hover:bg-[var(--border)] self-baseline cursor-pointer"
              onClick={() => {
                setShowWorkspaceModal(true);
              }}
            >
              <FiEdit2 />
            </span>
          </div>
        </div>
        <p className="mb-4 text-sm text-gray-400">
          This is a dummy description
        </p>
      </div>
      <hr className="my-2 border-[var(--border)]" />
      <div>
        <p className="text-[var(--muted-text)] font-bold mb-3">Your boards</p>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {workspace.boards?.map((board) => (
            <BoardCard
              key={board._id}
              title={board.title}
              description={board.description}
              onClick={() =>
                navigate(`/app/workspace/${workspace._id}/board/${board._id}`)
              }
            />
          ))}
          <div
            onClick={handleCreateBoard}
            key="create-board"
            className="bg-[var(--surface)] h-25 flex justify-center rounded-xl shadow-sm hover:shadow-md transition duration-100 cursor-pointer"
          >
            <h2 className="text-sm text-[var(--muted-text)] self-center mb-1 truncate">
              Create new board
            </h2>
          </div>
        </div>
      </div>
      {showModal && <CreateBoardModel setShowModal={setShowModal} />}
      {showWorkspaceModal && (
        <UpdateWorkspaceModal setShowModal={setShowWorkspaceModal} />
      )}
    </div>
  );
};

export default WorkspacePage;
