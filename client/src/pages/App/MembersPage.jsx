import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { useWorkspace } from "../../context/WorkspaceContext.jsx";
import MemberCard from "../../components/Cards/MemberCard.jsx";
import {
  fetchMembers,
  handleAddMember,
} from "../../services/workspaceService.js";
import { FaUserPlus, FaSearch } from "react-icons/fa";

const MembersPage = () => {
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
    <div className="p-6 text-[var(--text)] min-h-screen bg-[var(--bg-primary)]">
      {/* Page Header */}
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-3xl font-bold tracking-wide">Members</h1>
        <span className="px-3 py-1 rounded-full bg-[var(--accent)] text-white text-sm font-semibold">
          {workspace?.title || "Workspace"}
        </span>
      </div>

      {/* Add Member Input */}
      <div className="mb-6 flex gap-2 items-center bg-[var(--bg-secondary)] p-3 rounded-lg shadow">
        <div className="flex items-center flex-1 bg-transparent border border-gray-600 rounded-lg px-3">
          <FaUserPlus className="text-[var(--accent)] mr-2" />
          <input
            type="text"
            placeholder="Add member by username..."
            value={newMemberUsername}
            onChange={(e) => setNewMemberUsername(e.target.value)}
            className="w-full p-2 bg-transparent focus:outline-none"
          />
        </div>
        <button
          className="px-4 py-2 rounded-lg bg-green-500 hover:bg-green-600 text-white font-semibold shadow"
          onClick={() =>
            handleAddMember({ workspaceId, newMemberUsername, setMembers })
          }
        >
          Add
        </button>
      </div>

      {/* Search */}
      <div className="mb-4 flex items-center bg-[var(--bg-secondary)] border border-gray-600 rounded-lg px-3">
        <FaSearch className="text-[var(--accent)] mr-2" />
        <input
          type="text"
          placeholder="Search members..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full p-2 bg-transparent focus:outline-none"
        />
      </div>

      {/* Member List */}
      {filteredMembers.length > 0 ? (
        <ul className="space-y-3">
          {filteredMembers.map((member) => (
            <li key={member._id}>
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
