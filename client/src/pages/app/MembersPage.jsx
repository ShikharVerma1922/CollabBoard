import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { useWorkspace } from "../../context/WorkspaceContext.jsx";
import MemberCard from "../../components/cards/MemberCard.jsx";
import {
  fetchMembers,
  handleAddMember,
} from "../../services/workspaceService.js";
import { FaUserPlus, FaSearch } from "react-icons/fa";

const MembersPage = () => {
  // Leave workspace handler
  const handleLeaveWorkspace = async () => {
    const confirmed = window.confirm(
      "Are you sure you want to leave this workspace?"
    );
    if (!confirmed) return;
    try {
      const res = await fetch(
        `${import.meta.env.VITE_SERVER_URL}/workspaces/${workspaceId}/leave`,
        {
          method: "POST",
          credentials: "include",
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
      if (res.ok) {
        window.location.href = "/"; // Redirect to home or workspaces list
      } else {
        const data = await res.json();
        alert(data.message || "Failed to leave workspace");
      }
    } catch (err) {
      alert("Error leaving workspace");
    }
  };
  const { workspaceId } = useParams();
  const [members, setMembers] = useState([]);
  const [search, setSearch] = useState("");
  const [newMemberUsername, setNewMemberUsername] = useState("");
  const { workspace, setWorkspace } = useWorkspace();
  const [currentUserRole, setCurrentUserRole] = useState(null);

  useEffect(() => {
    fetchMembers({ workspaceId, setMembers, setWorkspace, setCurrentUserRole });
  }, [workspaceId]);

  const filteredMembers = members.filter(
    (member) =>
      member.fullName?.toLowerCase().includes(search.toLowerCase()) ||
      member.username?.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="p-4 sm:p-8 text-[var(--text)] min-h-screen bg-[var(--bg-primary)]">
      {/* Page Header with Leave Workspace Button */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-6 gap-2">
        <div className="flex items-center gap-3">
          <h1 className="text-3xl font-bold tracking-wide">Members</h1>
          <span className="px-3 py-1 rounded-full bg-[var(--accent)] text-white text-sm font-semibold shadow">
            {workspace?.title || "Workspace"}
          </span>
        </div>
        <div className="flex items-center gap-2 mt-2 sm:mt-0">
          <button
            className="px-4 py-2 rounded-lg bg-red-500 hover:bg-red-600 active:bg-red-700 transition text-white font-semibold shadow-md"
            onClick={handleLeaveWorkspace}
          >
            Leave Workspace
          </button>
        </div>
      </div>

      {/* Add Member Input */}
      <div className="mb-6 flex flex-col sm:flex-row gap-2 items-center bg-[var(--bg-secondary)] p-4 rounded-xl shadow-lg">
        <div className="flex items-center flex-1 bg-transparent border border-gray-600 rounded-lg px-3 py-2">
          <FaUserPlus className="text-[var(--accent)] mr-2 text-lg" />
          <input
            type="text"
            placeholder="Add member by username..."
            value={newMemberUsername}
            onChange={(e) => setNewMemberUsername(e.target.value)}
            className="w-full p-2 bg-transparent focus:outline-none text-base"
          />
        </div>
        <button
          className="px-5 py-2 rounded-lg bg-green-500 hover:bg-green-600 active:bg-green-700 transition text-white font-semibold shadow-md"
          onClick={() =>
            handleAddMember({ workspaceId, newMemberUsername, setMembers })
          }
        >
          Add
        </button>
      </div>

      {/* Search */}
      <div className="mb-6 flex items-center bg-[var(--bg-secondary)] border border-gray-600 rounded-lg px-3 py-2 shadow">
        <FaSearch className="text-[var(--accent)] mr-2 text-lg" />
        <input
          type="text"
          placeholder="Search members..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full p-2 bg-transparent focus:outline-none text-base"
        />
      </div>

      {/* Member List */}
      {filteredMembers.length > 0 ? (
        <ul className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {filteredMembers.map((member) => (
            <li
              key={member._id}
              className="transition-transform hover:scale-[1.02]"
            >
              <MemberCard
                member={member}
                currentUserRole={currentUserRole}
                setMembers={setMembers}
              />
            </li>
          ))}
        </ul>
      ) : (
        <div className="text-center py-10 text-gray-400 italic">
          No members found.
        </div>
      )}
    </div>
  );
};

export default MembersPage;
