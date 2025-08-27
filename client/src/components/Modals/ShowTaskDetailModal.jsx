import React, { useEffect, useState } from "react";
import { format } from "date-fns";
import {
  FaUser,
  FaCalendarAlt,
  FaTasks,
  FaClipboardList,
} from "react-icons/fa";
import axios from "axios";
import { useWorkspace } from "../../context/WorkspaceContext.jsx";
import Select from "react-select";
import { MdDelete } from "react-icons/md";

const ShowTaskDetailModal = ({ isOpen, onClose, task }) => {
  if (!isOpen || !task) return null;

  const formatDate = (date) => {
    if (!date) return "";
    return format(new Date(date), "yyyy-MM-dd'T'HH:mm");
  };

  // Permissions
  const isAllowedToEdit = task.isCreator || task.isAssignedUser;
  const isAllowedToAssign = task.isCreator;

  // Local state for form fields
  const [formData, setFormData] = useState({
    title: task.title || "",
    description: task.description || "",
    dueDate: task.dueDate ? formatDate(task.dueDate) : "",
    completed: !!task.completed,
    assignedTo: task.assignedTo || "",
  });
  const { workspace, board, members, setMembers, setBoard } = useWorkspace();

  useEffect(() => {
    setFormData({
      title: task.title || "",
      description: task.description || "",
      dueDate: task.dueDate ? formatDate(task.dueDate) : "",
      completed: !!task.completed,
      assignedTo: task.assignedTo || "",
    });
  }, [task]);

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

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  // Dedicated handler for react-select
  const handleAssignedToChange = (selectedOption) => {
    setFormData((prev) => ({
      ...prev,
      assignedTo: selectedOption ? selectedOption.value : "",
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Build an object with only changed fields
    const changedFields = {};
    if (formData.title !== (task.title || ""))
      changedFields.title = formData.title;
    if (formData.description !== (task.description || ""))
      changedFields.description = formData.description;
    if (formData.dueDate !== (task.dueDate ? formatDate(task.dueDate) : ""))
      changedFields.dueDate = formData.dueDate;
    if (formData.completed !== !!task.completed)
      changedFields.completed = formData.completed;
    if (formData.assignedTo !== (task.assignedTo || ""))
      changedFields.assignedTo = formData.assignedTo;

    if (Object.keys(changedFields).length === 0) {
      onClose();
      return;
    }

    const updateTaskData = async () => {
      try {
        const res = await axios.patch(
          `${import.meta.env.VITE_SERVER}/workspaces/${workspace._id}/boards/${
            board._id
          }/columns/${task.column._id}/tasks/${task._id}`,
          changedFields,
          {
            withCredentials: true,
          }
        );
        // Assuming the backend returns the updated task as res.data.data
        const updatedTask = res.data?.data;
        if (updatedTask) {
          setBoard((prevBoard) => {
            return {
              ...prevBoard,
              columns: prevBoard.columns.map((col) =>
                col._id === updatedTask.column
                  ? {
                      ...col,
                      tasks: col.tasks.map((t) =>
                        t._id === updatedTask._id ? updatedTask : t
                      ),
                    }
                  : col
              ),
            };
          });
        }
      } catch (error) {
        console.log("Error updating task data", error);
      }
    };

    updateTaskData();
    onClose();
  };

  const handleTaskDelete = async () => {
    try {
      await axios.delete(
        `${import.meta.env.VITE_SERVER}/workspaces/${workspace._id}/boards/${
          board._id
        }/columns/${task.column._id}/tasks/${task._id}`,
        { withCredentials: true }
      );
      setBoard((prevBoard) => {
        return {
          ...prevBoard,
          columns: prevBoard.columns.map((col) =>
            col._id === task.column._id
              ? {
                  ...col,
                  tasks: col.tasks.filter((t) => t._id !== task._id),
                }
              : col
          ),
        };
      });
      onClose();
    } catch (err) {
      console.error("Failed to delete task:", err);
      alert("Failed to delete task.");
    }
  };

  return (
    <div
      className="fixed inset-0 bg-black/50 flex items-center justify-center z-50"
      onClick={onClose}
    >
      <div
        className="bg-[var(--bg)] text-white w-full max-w-lg rounded-lg shadow-lg p-6 relative animate-fadeIn"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-3 right-3 text-gray-400 hover:text-[var(--hover-accent)] text-2xl cursor-pointer"
        >
          &times;
        </button>

        <form onSubmit={handleSubmit} className="space-y-4 text-[var(--text)]">
          {/* Title */}
          <div>
            <label className="block font-semibold mb-1">Title</label>
            <input
              type="text"
              name="title"
              value={formData.title}
              onChange={handleChange}
              className="w-full px-3 py-2 rounded bg-[var(--surface)] border border-[var(--border)] focus:outline-none focus:ring-2 focus:ring-[var(--accent)]"
              disabled={!isAllowedToEdit}
            />
          </div>

          {/* Description */}
          <div>
            <label className="block font-semibold mb-1 ">Description</label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleChange}
              className="w-full px-3 py-2 rounded bg-[var(--surface)] border border-[var(--border)] focus:outline-none focus:ring-2 focus:ring-[var(--accent)]"
              disabled={!isAllowedToEdit}
              rows={3}
            />
          </div>

          <div className="flex gap-4 items-end justify-between">
            {/* Due Date */}
            <div>
              <label className="block font-semibold mb-1">Due Date</label>
              <input
                type="datetime-local"
                name="dueDate"
                value={formData.dueDate}
                onChange={handleChange}
                className="w-full px-3 py-2 rounded bg-[var(--surface)] border border-[var(--border)] focus:outline-none focus:ring-2 focus:ring-[var(--accent)]"
                disabled={!isAllowedToEdit}
              />
            </div>

            {/* Completed */}
            <div className="flex items-center gap-2 mb-1">
              <input
                id="completed-checkbox"
                type="checkbox"
                name="completed"
                checked={formData.completed}
                onChange={handleChange}
                disabled={!isAllowedToEdit}
                className="w-8 h-8 cursor-pointer"
              />
              <label
                className="font-semibold cursor-pointer"
                htmlFor="completed-checkbox"
              >
                Completed
              </label>
            </div>
          </div>

          {/* Column (read-only) */}
          <div>
            <label className="block font-semibold mb-1 ">Column</label>
            <input
              type="text"
              value={task.column?.title || "Unknown"}
              className="w-full px-3 py-2 rounded bg-[var(--surface)] border border-[var(--border)]"
              disabled
            />
          </div>
          <div className="grid grid-cols-2 gap-4">
            {/* Assigned To */}
            <div>
              <label className="block font-semibold mb-1">Assigned To</label>
              <Select
                options={members.map((member) => ({
                  value: member._id,
                  member,
                }))}
                onChange={handleAssignedToChange}
                value={
                  members
                    .map((member) => ({ value: member._id, member }))
                    .find((option) => option.value === formData.assignedTo) ||
                  null
                }
                className="mb-3 cursor-pointer"
                classNamePrefix="react-select"
                placeholder="Assign to..."
                isClearable
                isSearchable
                isDisabled={!isAllowedToAssign}
                filterOption={(option, inputValue) =>
                  option.data.member.username
                    ?.toLowerCase()
                    .includes(inputValue.toLowerCase()) ||
                  option.data.member.fullName
                    ?.toLowerCase()
                    .includes(inputValue.toLowerCase())
                }
                formatOptionLabel={({ member }) => (
                  <div className="flex justify-between text-black cursor-pointer">
                    <span className="flex gap-2">
                      <span>{member.fullName}</span>
                      <span className="text-[var(--muted-text)]">
                        @{member.username}
                      </span>
                    </span>
                    <span className="text-sm text-gray-500 dark:text-gray-400">
                      <strong className="text-green-500">
                        {member.role === "admin" ? "Admin" : ""}
                      </strong>
                    </span>
                  </div>
                )}
              />
            </div>

            {/* Created By (read-only) */}
            <div>
              <label className="block font-semibold mb-1">Created By</label>
              <div className="w-full px-3 py-2 rounded bg-[var(--surface)] border border-[var(--border)] flex gap-2">
                <span className="text-[var(--text)]">
                  {task.createdBy?.fullName || "N/A"}
                </span>
                <span className="text-[var(--muted-text)]">
                  @{task.createdBy?.username}
                </span>
              </div>
              {/* className="w-full px-3 py-2 rounded bg-gray-800 text-white border border-gray-700" */}
            </div>
          </div>
          {/* Timestamps (read-only) */}
          <div className="flex gap-4 text-sm text-gray-400 mt-2">
            <span>Created At: {format(new Date(task.createdAt), "PPP p")}</span>
            <span>
              Last Updated: {format(new Date(task.updatedAt), "PPP p")}
            </span>
          </div>

          {/* Save Button */}
          {isAllowedToEdit && (
            <button
              type="submit"
              className="w-full mt-4 py-2 rounded bg-[var(--accent)] text-white font-semibold shadow hover:brightness-110 transition"
            >
              Save
            </button>
          )}
          {isAllowedToAssign && (
            <button
              type="button"
              className="w-full mt-2 py-2 rounded bg-red-600 text-white font-semibold flex items-center justify-center gap-2 shadow hover:bg-red-700 transition"
              onClick={handleTaskDelete}
            >
              <MdDelete className="text-xl" />
              Delete Task
            </button>
          )}
        </form>
      </div>
    </div>
  );
};

export default ShowTaskDetailModal;
