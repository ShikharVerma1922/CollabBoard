import React, { useEffect, useState } from "react";
import axios from "axios";
import { FiUser } from "react-icons/fi";
import toast from "react-hot-toast";
import { useAuth } from "../../context/authContext";

const Profile = () => {
  const { user, setUser } = useAuth(null);
  const [loading, setLoading] = useState(false);
  const [editName, setEditName] = useState(false);
  const [newFullName, setNewFullName] = useState("");
  const [avatarFile, setAvatarFile] = useState(null);
  const [avatarUploading, setAvatarUploading] = useState(false);
  const [nameSaving, setNameSaving] = useState(false);
  const [deleteConfirm, setDeleteConfirm] = useState("");
  const [deleteError, setDeleteError] = useState("");

  //   useEffect(() => {
  //     const fetchUser = async () => {
  //       setLoading(true);
  //       try {
  //         const res = await axios.get(`${import.meta.env.VITE_SERVER}/users/me`, {
  //           withCredentials: true,
  //         });
  //         setUser(res.data.data.user);
  //       } catch (err) {
  //         setUser(null);
  //       }
  //       setLoading(false);
  //     };
  //     fetchUser();
  //   }, []);

  const handleFullNameUpdate = async () => {
    setNameSaving(true);
    try {
      await axios.patch(
        `${import.meta.env.VITE_SERVER}/users/fullName`,
        { fullName: newFullName },
        { withCredentials: true }
      );
      setUser((u) => ({ ...u, fullName: newFullName }));
      setEditName(false);
    } catch (err) {
      toast.error("Failed to update full name.");
    }
    setNameSaving(false);
  };

  const handleAvatarUpdate = async () => {
    if (!avatarFile) return;
    setAvatarUploading(true);
    const formData = new FormData();
    formData.append("avatar", avatarFile);
    try {
      const res = await axios.patch(
        `${import.meta.env.VITE_SERVER}/users/avatar`,
        formData,
        { withCredentials: true }
      );
      setUser((u) => ({ ...u, avatar: res.data.data.avatar }));
      setAvatarFile(null);
    } catch (err) {}
    setAvatarUploading(false);
  };

  const handleDeleteAccount = async () => {
    setDeleteError("");
    if (deleteConfirm !== user.username) {
      setDeleteError("Username does not match.");
      return;
    }
    try {
      await axios.delete(`${import.meta.env.VITE_SERVER}/user/delete`, {
        data: { username: deleteConfirm },
        withCredentials: true,
      });
      window.location.href = "/";
    } catch (err) {
      setDeleteError("Failed to delete account.");
    }
  };

  if (loading) return <div className="p-8 text-center">Loading...</div>;
  if (!user)
    return (
      <div className="p-8 text-center text-red-500">
        Failed to load profile.
      </div>
    );

  return (
    <div className="max-w-md mx-auto p-6 bg-white dark:bg-zinc-900 rounded-xl shadow mt-8">
      <div className="flex flex-col items-center gap-4 mb-6">
        <div className="relative group">
          {user.avatar ? (
            <img
              src={user.avatar}
              alt="avatar"
              className="w-24 h-24 rounded-full object-cover border"
            />
          ) : (
            <span className="w-24 h-24 flex items-center justify-center rounded-full bg-gray-200 dark:bg-zinc-800 border">
              <FiUser className="text-5xl text-gray-500" />
            </span>
          )}
          <label
            htmlFor="avatar-upload"
            className="absolute bottom-2 right-2 bg-[var(--accent)] p-2 rounded-full cursor-pointer shadow group-hover:scale-110 transition flex items-center justify-center"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="w-4 h-4 text-white"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M15.232 5.232l3.536 3.536M9 13l6.586-6.586a2 2 0 112.828 2.828L11.828 15.828a2 2 0 01-2.828 0L9 13zm-6 6v-2a2 2 0 012-2h2"
              />
            </svg>
            <input
              id="avatar-upload"
              type="file"
              accept="image/*"
              className="hidden"
              onChange={async (e) => {
                if (!e.target.files[0]) return;
                setAvatarUploading(true);
                const formData = new FormData();
                formData.append("avatar", e.target.files[0]);
                try {
                  const res = await axios.patch(
                    `${import.meta.env.VITE_SERVER}/users/avatar`,
                    formData,
                    { withCredentials: true }
                  );
                  setUser((u) => ({ ...u, avatar: res.data.data.avatar }));
                  toast.success("Avatar updated successfully!");
                } catch (err) {
                  toast.error("Failed to update avatar.");
                }
                setAvatarUploading(false);
                e.target.value = "";
              }}
              disabled={avatarUploading}
            />
          </label>
          {avatarUploading && (
            <div className="absolute inset-0 bg-black bg-opacity-30 flex items-center justify-center rounded-full">
              <span className="text-white text-xs">Uploading...</span>
            </div>
          )}
        </div>
        <div className="flex flex-col items-center gap-1">
          <span className="font-bold text-xl text-[var(--text)]">
            {user.fullName}
          </span>
          <span className="text-gray-500">@{user.username}</span>
        </div>
        <span className="text-sm text-gray-400">
          Joined: {new Date(user.createdAt).toLocaleDateString()}
        </span>
      </div>
      <div className="mb-6">
        <label className="font-semibold mb-1 flex items-center gap-2">
          <svg
            className="w-5 h-5 text-[var(--accent)]"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M16.5 8.25l-4.5 3-4.5-3m9 7.5v-6.75a2.25 2.25 0 00-2.25-2.25h-5.25A2.25 2.25 0 005.25 8.25v6.75m13.5 0a2.25 2.25 0 01-2.25 2.25h-9a2.25 2.25 0 01-2.25-2.25"
            />
          </svg>
          Email
        </label>
        <div className="bg-gray-100 dark:bg-zinc-800 rounded px-3 py-2 text-[var(--text)] font-mono tracking-wide border border-gray-200 dark:border-zinc-700">
          {user.email}
        </div>
      </div>
      <div className="mb-6">
        <label className="font-semibold mb-1 flex items-center gap-2">
          <svg
            className="w-5 h-5 text-[var(--accent)]"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M5.121 17.804A9.001 9.001 0 0112 15c2.21 0 4.21.805 5.879 2.146M15 11a3 3 0 11-6 0 3 3 0 016 0z"
            />
          </svg>
          Full Name
        </label>
        {editName ? (
          <div className="flex gap-2 items-center">
            <input
              type="text"
              value={newFullName}
              onChange={(e) => setNewFullName(e.target.value)}
              className="border border-[var(--accent)] rounded px-3 py-2 w-full focus:outline-none focus:ring-2 focus:ring-[var(--accent)] text-[var(--text)] bg-gray-50 dark:bg-zinc-800"
              disabled={nameSaving}
            />
            <button
              className="bg-[var(--accent)] text-white px-4 py-2 rounded shadow hover:brightness-110 transition font-semibold"
              onClick={handleFullNameUpdate}
              disabled={nameSaving}
            >
              {nameSaving ? "Saving..." : "Save"}
            </button>
            <button
              className="bg-gray-300 dark:bg-zinc-700 text-gray-700 dark:text-gray-200 px-4 py-2 rounded shadow font-semibold"
              onClick={() => setEditName(false)}
              disabled={nameSaving}
            >
              Cancel
            </button>
          </div>
        ) : (
          <div className="flex gap-2 items-center">
            <span className="text-[var(--text)] font-semibold">
              {user.fullName}
            </span>
            <button
              className="text-xs text-[var(--accent)] underline hover:brightness-110 font-semibold"
              onClick={() => {
                setEditName(true);
                setNewFullName(user.fullName);
              }}
            >
              Edit
            </button>
          </div>
        )}
      </div>
      <div className="mt-8 border-t pt-6">
        <label className="block font-semibold mb-2 text-red-600">
          Delete Account
        </label>
        <input
          type="text"
          placeholder="Type your username to confirm"
          value={deleteConfirm}
          onChange={(e) => setDeleteConfirm(e.target.value)}
          className="border rounded px-2 py-1 w-full mb-2"
        />
        <button
          className="bg-red-600 text-white px-4 py-2 rounded w-full"
          onClick={handleDeleteAccount}
        >
          Delete Account
        </button>
        {deleteError && (
          <div className="text-red-500 mt-2 text-sm">{deleteError}</div>
        )}
      </div>
    </div>
  );
};

export default Profile;
