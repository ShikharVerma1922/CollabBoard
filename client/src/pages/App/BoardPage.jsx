import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import { useWorkspace } from "../../context/WorkspaceContext.jsx";
import ColumnCard from "../../components/Cards/ColumnCard.jsx";
import { FiPlus } from "react-icons/fi";
import CreateColumnModal from "../../components/Modals/CreateColumnModal.jsx";

const BoardPage = () => {
  const { workspaceId, boardId } = useParams();
  const { board, setBoard, setWorkspace } = useWorkspace();
  const [loading, setLoading] = useState(true);
  const [showCreateColumn, setShowCreateColumn] = useState(false);

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

  useEffect(() => {
    const fetchWorkspace = async () => {
      try {
        const res = await axios.get(
          `${import.meta.env.VITE_SERVER}/workspaces/${workspaceId}`,
          {
            withCredentials: true,
          }
        );
        setWorkspace(res.data.data);
      } catch (error) {
        console.error("Error fetching board:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchWorkspace();
  }, [workspaceId, boardId]);

  if (loading) return <p className="p-4 text-[var(--text)]">Loading...</p>;
  if (!board) return <p className="p-4 text-[var(--text)]">Board not found</p>;

  return (
    <div className="text-[var(--text)] p-4 overflow-x-auto min-h-screen">
      <h1 className="text-2xl font-bold mb-2">{board.title}</h1>
      <p className="mb-4 text-sm text-gray-400">{board.description}</p>

      <div className="flex gap-4 overflow-x-auto w-full pb-2 flex-nowrap scroll-smooth scrollbar-thin scrollbar-thumb-[var(--border)] min-w-fit">
        {/* Placeholder for columns */}
        {board.columns.map((column) => (
          <ColumnCard
            key={column._id}
            title={column.title}
            color={column.color}
            description={column.description}
            visibility={column.visibility}
            columnId={column._id}
          />
        ))}
        <div>
          <div
            onClick={() => setShowCreateColumn(true)}
            className="p-4 rounded-xl shadow-sm hover:shadow-md transition duration-200 cursor-pointer border border-[var(--border)] min-w-70 h-15 bg-[var(--surface)] hover:bg-[var(--accent-surface)] flex gap-3 text-[var(--muted-text)]"
          >
            <span className="self-center text-xl">
              <FiPlus />
            </span>
            <span>Add another list</span>
          </div>

          {showCreateColumn && (
            <CreateColumnModal setShowModal={setShowCreateColumn} />
          )}
        </div>
      </div>
    </div>
  );
};

export default BoardPage;
