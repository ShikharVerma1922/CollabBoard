import axios from "axios";
import toast from "react-hot-toast";

const fetchWorkspaces = async ({ setWorkspaceList }) => {
  try {
    const res = await axios.get(`${import.meta.env.VITE_SERVER}/workspaces`, {
      withCredentials: true,
    });
    setWorkspaceList(res.data.data);
  } catch (error) {
    console.log(error);
  }
};

const fetchMembers = async ({
  workspaceId,
  setMembers,
  setWorkspace,
  setCurrentUserRole,
}) => {
  try {
    const res = await axios.get(
      `${import.meta.env.VITE_SERVER}/workspaces/${workspaceId}/members`,
      { withCredentials: true }
    );
    console.log(res.data.data.memberList);
    setMembers(res.data.data.memberList);
    setWorkspace(res.data.data.workspace);
    setCurrentUserRole(res.data.data.currentUserRole);
  } catch (err) {
    console.error("Failed to fetch members", err);
  }
};

const handleAddMember = async ({
  workspaceId,
  newMemberUsername,
  setMembers,
}) => {
  try {
    const res = await axios.post(
      `${import.meta.env.VITE_SERVER}/workspaces/${workspaceId}/members`,
      { members: [newMemberUsername] },
      { withCredentials: true }
    );
    toast.success(res.data.message);
    console.log(res.data);
  } catch (error) {
    console.error(error);
    toast.error(error.response.message);
  }
};

const confirmRemoveMember = async ({
  workspaceId,
  member,
  setShowDeletePopUp,
  setMembers,
}) => {
  try {
    const res = await axios.delete(
      `${import.meta.env.VITE_SERVER}/workspaces/${workspaceId}/members`,
      {
        data: { username: member.username },
        withCredentials: true,
      }
    );

    if (res.data.success)
      setMembers((prev) => prev.filter((m) => m._id !== member._id));

    toast.success(`Member ${member.username} removed successfully`);
  } catch (error) {
    console.error(error);
    toast.error(error.response.data.message);
  } finally {
    setShowDeletePopUp(false);
  }
};

const confirmUpdateRoleStatus = async ({
  confirmMember,
  workspaceId,
  setConfirmMember,
  setMembers,
}) => {
  if (!confirmMember) return;

  const action = confirmMember.role === "admin" ? "demote" : "promote";

  try {
    const res = await axios.patch(
      `${import.meta.env.VITE_SERVER}/workspaces/${workspaceId}/admins`,
      {
        username: confirmMember.username,
        action,
      },
      { withCredentials: true }
    );

    if (res.data.success)
      setMembers((prev) =>
        prev.map((m) =>
          m._id === confirmMember._id
            ? {
                ...m,
                role: confirmMember.role === "admin" ? "member" : "admin",
              }
            : m
        )
      );

    toast.success(res.data.message || "Role updated successfully");
  } catch (error) {
    console.error(error);
    toast.error("Failed to update role");
  } finally {
    setConfirmMember(null);
  }
};

export {
  fetchWorkspaces,
  fetchMembers,
  confirmRemoveMember,
  confirmUpdateRoleStatus,
  handleAddMember,
};
