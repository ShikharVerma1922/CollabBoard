import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import { useWorkspace } from "../../context/WorkspaceContext.jsx";

const BoardPage = () => {
  const { workspaceId, boardId } = useParams();
  const { board, setBoard } = useWorkspace();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchBoard = async () => {
      try {
        const res = await axios.get(
          `${
            import.meta.env.VITE_SERVER
          }/workspaces/${workspaceId}/boards/${boardId}`,
          {
            withCredentials: true,
          }
        );
        setBoard(res.data.data);
      } catch (error) {
        console.error("Error fetching board:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchBoard();
  }, [workspaceId, boardId]);

  if (loading) return <p className="p-4 text-[var(--text)]">Loading...</p>;
  if (!board) return <p className="p-4 text-[var(--text)]">Board not found</p>;

  return (
    <div className="text-[var(--text)] p-4">
      <h1 className="text-2xl font-bold mb-2">{board.title}</h1>
      <p className="mb-4 text-sm text-gray-400">{board.description}</p>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Placeholder for columns */}
        <div className="bg-[var(--surface)] p-4 rounded-lg shadow-sm text-sm text-gray-400">
          Columns will appear here.
        </div>
      </div>
    </div>
  );
};

export default BoardPage;
