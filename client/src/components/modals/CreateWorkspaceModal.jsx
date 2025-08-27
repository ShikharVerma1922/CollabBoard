import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import FormInput from "../form/FormInput.jsx";
import FormButton from "../form/FormButton.jsx";
import axios from "axios";
import { useWorkspaceList } from "../../context/WorkspaceListContext.jsx";

const CreateWorkspaceModel = ({ setShowModal }) => {
  const {
    register,
    handleSubmit,
    setFocus,
    formState: { errors },
  } = useForm();

  const [loading, setLoading] = useState(false);
  const { setWorkspaceList } = useWorkspaceList();

  useEffect(() => {
    setFocus("title");
  }, [setFocus]);

  const onSubmit = async ({ title, description }) => {
    setLoading(true);
    try {
      const res = await axios.post(
        `${import.meta.env.VITE_SERVER}/workspaces`,
        { title, description },
        { withCredentials: true }
      );
      setWorkspaceList((prev) => [...prev, res.data.data]);
      setShowModal(false);
    } catch (error) {
      console.error("Error creating workspace:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex justify-center items-center z-50 px-4">
      <div className="relative bg-[var(--surface)] text-[var(--text)] rounded-lg shadow-md p-6 w-[90%] sm:max-w-md">
        <button
          onClick={() => setShowModal(false)}
          className="absolute top-3 right-4 text-xl font-bold text-[var(--text)] hover:text-[var(--accent)] focus:outline-none cursor-pointer"
        >
          &times;
        </button>
        <h2 className="text-lg font-bold mb-4">Create New Workspace</h2>
        <form onSubmit={(e) => handleSubmit(onSubmit)(e)} className="space-y-4">
          <FormInput
            label="Title"
            name="title"
            register={register}
            rules={{ required: "Title is required" }}
            error={errors.title}
          />
          <FormInput
            label="Description"
            name="description"
            register={register}
            rules={{ required: "Description is required" }}
            error={errors.description}
          />
          <div className="flex justify-end gap-2">
            <FormButton
              loading={loading}
              text="Create"
              loadingText="Creating..."
            />
          </div>
        </form>
      </div>
    </div>
  );
};

export default CreateWorkspaceModel;
