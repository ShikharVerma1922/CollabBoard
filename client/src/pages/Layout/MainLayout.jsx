import { Outlet, useNavigate, useLocation } from "react-router-dom";
import { useEffect, useState } from "react";
import { FiBell, FiUser, FiChevronLeft, FiChevronRight } from "react-icons/fi";
import { HiOutlineViewGrid, HiOutlineCollection } from "react-icons/hi";
import {
  TbLayoutSidebarLeftCollapse,
  TbLayoutSidebarLeftExpand,
} from "react-icons/tb";
import { FaSearch } from "react-icons/fa";
import SideBar from "../../components/navigationBars/SideBar.jsx";
import { useWorkspace } from "../../context/WorkspaceContext.jsx";
import Topbar from "../../components/navigationBars/Topbar.jsx";
import ChatModal from "../../components/chat/ChatModal.jsx";

const MainLayout = () => {
  const [chatVisible, setChatVisible] = useState(false);
  const [chatWorkspaceId, setChatWorkspaceId] = useState(null);
  const [chatWorkspaceTitle, setChatWorkspaceTitle] = useState(null);

  const handleToggleChatModal = (workspaceId, workspaceTitle) => {
    setChatWorkspaceId(workspaceId);
    setChatWorkspaceTitle(workspaceTitle);
    setChatVisible((prev) => !prev);
  };

  return (
    <div className="flex w-full h-screen bg-[var(--bg)]">
      <SideBar toggleChatModal={handleToggleChatModal} />
      <div className="flex flex-1 flex-col w-full h-full text-[var(--text)] overflow-hidden">
        <main className="flex-1 overflow-y-auto p-4">
          <Topbar />
          <Outlet />
        </main>
      </div>
      <ChatModal
        visible={chatVisible}
        workspaceId={chatWorkspaceId}
        workspaceTitle={chatWorkspaceTitle}
        setChatVisible={setChatVisible}
      />
    </div>
  );
};

export default MainLayout;
