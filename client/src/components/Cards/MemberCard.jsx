import { useState } from "react";
import { MdDelete } from "react-icons/md";
import { useAuth } from "../../context/authContext.jsx";
import { useParams } from "react-router-dom";
import PopUpModal from "../Modals/PopUpModal.jsx";
import { FaRegUser } from "react-icons/fa";
import {
  confirmRemoveMember,
  confirmUpdateRoleStatus,
} from "../../services/workspaceService.js";

const MemberCard = ({ member, currentUserRole, setMembers }) => {
  const { user } = useAuth();
  const { workspaceId } = useParams();
  const [confirmMember, setConfirmMember] = useState(null);
  const [showDeletePopUp, setShowDeletePopUp] = useState(false);

  return (
    <div className="border p-3 rounded bg-[var(--card)] flex justify-between items-center group">
      <div className="flex items-center gap-3">
        {member.avatar ? (
          <img
            src={member.avatar}
            alt={member.username + " avatar"}
            className="w-9 h-9 object-cover rounded-full border border-gray-300 dark:border-zinc-700"
          />
        ) : (
          <span className="w-9 h-9 flex items-center justify-center rounded-full bg-gray-200 dark:bg-zinc-800 border border-gray-300 dark:border-zinc-700">
            <FaRegUser className="text-[var(--muted-text)]" />
          </span>
        )}
        <div>
          <p className="font-medium">{member.fullName}</p>
          <p className="text-sm text-gray-500">@{member.username}</p>
        </div>
      </div>
      <div className="flex gap-2">
        {member._id === user._id && (
          <span className="text-xs px-2 py-1 rounded bg-gray-200 dark:bg-zinc-800 text-gray-700 dark:text-gray-300 cursor-default">
            You
          </span>
        )}
        <span
          className={`text-xs px-2 py-1 rounded bg-gray-200 dark:bg-zinc-800 text-gray-700 dark:text-gray-300 ${
            member._id !== user._id && currentUserRole === "admin"
              ? "hover:bg-gray-300 dark:hover:bg-zinc-600 cursor-pointer"
              : "cursor-default"
          }`}
          onClick={() => {
            member._id !== user._id && setConfirmMember(member);
          }}
        >
          {member.role}
        </span>
        {currentUserRole === "admin" && member._id !== user._id && (
          <span
            className="block sm:hidden group-hover:block self-center"
            onClick={() => {
              setShowDeletePopUp(true);
            }}
          >
            <MdDelete className="hover:text-red-500 cursor-pointer" />
          </span>
        )}
      </div>
      {confirmMember && currentUserRole === "admin" && (
        <PopUpModal
          handleCancel={() => setConfirmMember(null)}
          handleConfirm={() =>
            confirmUpdateRoleStatus({
              confirmMember,
              setConfirmMember,
              workspaceId,
              setMembers,
            })
          }
          message={
            <>
              Are you sure you want to{" "}
              {confirmMember.role === "admin" ? "demote" : "promote"}{" "}
              <strong>{confirmMember.fullName}</strong> (@
              {confirmMember.username})?
            </>
          }
        />
      )}
      {showDeletePopUp && currentUserRole === "admin" && (
        <PopUpModal
          handleCancel={() => setShowDeletePopUp(false)}
          handleConfirm={() =>
            confirmRemoveMember({
              workspaceId,
              member,
              setShowDeletePopUp,
              setMembers,
            })
          }
          message={
            <>
              Are you sure you want to remove <strong>{member.fullName}</strong>{" "}
              (@
              {member.username})?
            </>
          }
        />
      )}
    </div>
  );
};

export default MemberCard;
