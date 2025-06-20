import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { useWorkspace } from "../../context/WorkspaceContext.jsx";
import axios from "axios";

const CreateColumnModal = ({ setShowModal }) => {
  const {
    register,
    handleSubmit,
    setFocus,
    formState: { errors },
  } = useForm();

  const [loading, setLoading] = useState(false);
  const { board, setBoard, workspace, setWorkspace } = useWorkspace();

  useEffect(() => {
    setFocus("title");
  }, [setFocus]);

  const onSubmit = async ({ title, description, visibility, color }) => {
    setLoading(true);
    try {
      const res = await axios.post(
        `${import.meta.env.VITE_SERVER}/workspaces/${workspace._id}/boards/${
          board._id
        }/columns`,
        {
          title,
          description,
          visibility,
          color,
        },
        {
          withCredentials: true,
        }
      );
      console.log(res.data.data);
      setBoard((prev) => ({
        ...prev,
        columns: [...prev.columns, res.data.data],
      }));
      setShowModal(false);
    } catch (error) {
      console.log("Error in create column model: ", error);
    } finally {
      console.log(board);
      setLoading(false);
    }
  };

  return (
    <div className="bg-[var(--surface)] mt-2 p-4 rounded-lg shadow-md w-72 text-[var(--text)] border border-[var(--border)]">
      <div className="flex justify-between items-center mb-2">
        <h2 className="text-sm font-semibold">Create Column</h2>
        <button
          onClick={() => setShowModal(false)}
          className="text-lg font-bold text-[var(--text)] hover:text-[var(--accent)] cursor-pointer"
        >
          &times;
        </button>
      </div>
      <form
        onSubmit={(e) => {
          handleSubmit(onSubmit)(e);
        }}
      >
        <input
          type="text"
          placeholder="Column title"
          {...register("title", { required: "Title is required" })}
          className="w-full p-2 mb-3 border border-gray-300 rounded bg-transparent text-[var(--text)]"
        />
        {errors.title && (
          <p className="text-xs text-red-500 mb-2">{errors.title.message}</p>
        )}

        <textarea
          placeholder="Description"
          {...register("description")}
          className="w-full p-2 mb-3 border border-gray-300 rounded bg-transparent text-[var(--text)] resize-none"
          rows={3}
        />

        <label className="block text-sm mb-1">Color</label>
        <input
          type="color"
          {...register("color")}
          className="w-full h-10 mb-3 border border-gray-300 rounded bg-transparent cursor-pointer"
        />

        <label className="block text-sm mb-1">Visibility</label>
        <select
          {...register("visibility")}
          className="w-full p-2 mb-4 border border-gray-300 rounded bg-transparent text-[var(--text)]"
        >
          <option
            value="public"
            className="bg-[var(--surface)] text-[var(--text)]"
          >
            Public
          </option>
          <option
            value="private"
            className="bg-[var(--surface)] text-[var(--text)]"
          >
            Private
          </option>
        </select>

        <button
          type="submit"
          className="bg-[var(--accent)] px-4 py-1.5 rounded text-white w-full cursor-pointer"
        >
          Create
        </button>
      </form>
    </div>
  );
};

export default CreateColumnModal;
