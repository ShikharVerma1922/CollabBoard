import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { useWorkspace } from "../../context/WorkspaceContext.jsx";
import axios from "axios";
import { FiX } from "react-icons/fi";
import Select from "react-select";

const CreateTaskModal = ({ setShowModal, columnId }) => {
  const {
    register,
    handleSubmit,
    setFocus,
    setValue,
    formState: { errors },
  } = useForm();

  const [loading, setLoading] = useState(false);
  const { board, setBoard, workspace, setWorkspace, members, setMembers } =
    useWorkspace();

  useEffect(() => {
    setFocus("title");
  }, [setFocus]);

  useEffect(() => {
    const fetchMembers = async () => {
      try {
        const res = await axios.get(
          `${import.meta.env.VITE_SERVER}/workspaces/${workspace._id}/members`,
          { withCredentials: true }
        );
        setMembers(res.data.data.memberList);
      } catch (err) {
        console.error("Failed to fetch members:", err);
      }
    };

    if (workspace?._id && members.length === 0) {
      fetchMembers();
    }
  }, [workspace?._id]);

  const onSubmit = async ({ title, description, assignedTo, dueDate }) => {
    setLoading(true);
    try {
      const res = await axios.post(
        `${import.meta.env.VITE_SERVER}/workspaces/${workspace._id}/boards/${
          board._id
        }/columns/${columnId}/tasks`,
        {
          title,
          description,
          dueDate,
          assignedTo,
        },
        {
          withCredentials: true,
        }
      );
      setShowModal(false);
    } catch (error) {
      console.log("Error in create column model: ", error);
    } finally {
      console.log(board);
      setLoading(false);
    }
  };

  return (
    <div className="bg-[var(--surface)] mt-2 p-4 rounded-lg shadow-md w-full text-[var(--text)] border border-[var(--border)]">
      <form
        onSubmit={(e) => {
          handleSubmit(onSubmit)(e);
        }}
      >
        <input
          type="text"
          placeholder="Task title"
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

        <Select
          options={members.map((member) => ({
            value: member._id,
            member,
          }))}
          onChange={(selected) => setValue("assignedTo", selected?.value)}
          className="mb-3"
          classNamePrefix="react-select"
          placeholder="Assign to..."
          isClearable
          isSearchable
          filterOption={(option, inputValue) =>
            option.data.member.username
              ?.toLowerCase()
              .includes(inputValue.toLowerCase()) ||
            option.data.member.fullName
              ?.toLowerCase()
              .includes(inputValue.toLowerCase())
          }
          formatOptionLabel={({ member }) => (
            <div className="flex flex-col justify-between text-black">
              <div className="flex justify-between text-sm">
                <span>@{member.username}</span>
                <span className="text-sm text-gray-500 dark:text-gray-400">
                  <strong className="text-green-500">
                    {member.role === "admin" ? "Admin" : ""}
                  </strong>
                </span>
              </div>
              <span>{member.fullName}</span>
            </div>
          )}
        />

        <input
          type="date"
          {...register("dueDate")}
          className="w-full p-2 mb-3 border border-gray-300 rounded bg-transparent text-[var(--text)]"
        />

        <div className="flex gap-1 text-md  dark:text-black text-white">
          <button
            type="submit"
            className="bg-[var(--accent)] px-1 py-1.5 rounded  w-20 cursor-pointer hover:bg-[var(--hover-accent)]"
          >
            Add card
          </button>
          <button
            onClick={() => setShowModal(false)}
            className="bg-gray-500 dark:bg-gray-300 w-10 hover:bg-[var(--muted-text)] flex justify-center items-center rounded cursor-pointer"
          >
            <FiX />
          </button>
        </div>
      </form>
    </div>
  );
};

export default CreateTaskModal;
