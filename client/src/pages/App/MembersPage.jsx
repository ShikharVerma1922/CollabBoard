import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { useWorkspace } from "../../context/WorkspaceContext.jsx";
import MemberCard from "../../components/Cards/MemberCard.jsx";
import {
  fetchMembers,
  handleAddMember,
} from "../../services/workspaceService.js";

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
    <div className="p-4 text-[var(--text)]">
      <div className="mb-4 flex gap-2">
        <input
          type="text"
          placeholder="Add member by username..."
          value={newMemberUsername}
          onChange={(e) => setNewMemberUsername(e.target.value)}
          className="w-full p-2 border border-gray-300 rounded bg-transparent"
        />
        <button
          className="p-2 rounded m-1 text-[var(--text)] bg-green-500"
          onClick={() =>
            handleAddMember({ workspaceId, newMemberUsername, setMembers })
          }
        >
          Add
        </button>
      </div>
      <h2 className="text-xl font-semibold mb-4">Members</h2>

      <input
        type="text"
        placeholder="Search members..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        className="w-full p-2 mb-4 border border-gray-300 rounded bg-transparent"
      />

      <ul className="space-y-2">
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
    </div>
  );
};

export default MembersPage;
