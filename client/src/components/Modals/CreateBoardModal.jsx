import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import FormInput from "../form/FormInput.jsx";
import FormButton from "../form/FormButton.jsx";
import { useWorkspace } from "../../context/WorkspaceContext.jsx";
import axios from "axios";

const CreateBoardModel = ({ setShowModal }) => {
  const {
    register,
    handleSubmit,
    setError,
    setFocus,
    formState: { errors },
  } = useForm();

  const [loading, setLoading] = useState(false);
  const { workspace, setWorkspace } = useWorkspace();

  useEffect(() => {
    setFocus("title");
  }, [setFocus]);

  const onSubmit = async ({ title, description, visibility }) => {
    setLoading(true);
    try {
      const res = await axios.post(
        `${import.meta.env.VITE_SERVER}/workspaces/${workspace._id}/boards`,
        {
          title,
          description,
          visibility,
        },
        {
          withCredentials: true,
        }
      );
      console.log(res.data.data);
      setWorkspace((prev) => ({
        ...prev,
        boards: [...prev.boards, res.data.data],
      }));
      setShowModal(false);
    } catch (error) {
      console.log("Error in create board model: ", error);
    } finally {
      console.log(workspace);
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex justify-center items-center z-50 px-4">
      <div className="relative bg-[var(--surface)] text-[var(--text)] rounded-lg shadow-md p-6 w-[90%] sm:max-w-md">
        <button
          onClick={() => setShowModal(false)}
          className="absolute top-3 right-4 text-xl font-bold text-[var(--text)] hover:text-[var(--accent)] focus:outline-none"
        >
          &times;
        </button>
        <h2 className="text-lg font-bold mb-4">Create New Board</h2>
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
          <div className="flex gap-1 justify-between">
            <span className="p-2 border border-[#ebebeb] rounded transition-all  dark:bg-black dark:border-black bg-[#ebebeb] cursor-default">
              {workspace.title}
            </span>
            <label className="p-2 flex justify-center border border-[#ebebeb] rounded transition-all hover:border-black dark:bg-black dark:border-black bg-[#ebebeb]  dark:hover:border-white">
              <span className="block font-[Fira_Mono] text-[var(--text)] text-[12px] self-center">
                VISIBILITY:
              </span>
              <select
                {...register("visibility")}
                className="w-full rounded outline-none self-center font-mono text-[var(--text)] font-extralight cursor-pointer"
              >
                <option value="private">Private</option>
                <option value="public">Public</option>
              </select>
            </label>
          </div>
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

export default CreateBoardModel;
