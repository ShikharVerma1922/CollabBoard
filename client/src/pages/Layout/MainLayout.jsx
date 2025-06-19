import { Tooltip } from "react-tooltip";
import { Outlet, useNavigate, useLocation } from "react-router-dom";
import { useEffect, useState } from "react";
import { FiBell, FiUser, FiChevronLeft, FiChevronRight } from "react-icons/fi";
import { HiOutlineViewGrid, HiOutlineCollection } from "react-icons/hi";
import {
  TbLayoutSidebarLeftCollapse,
  TbLayoutSidebarLeftExpand,
} from "react-icons/tb";
import { FaSearch } from "react-icons/fa";
import SideBar from "../../components/NavigationBars/SideBar.jsx";
import { useWorkspace } from "../../context/WorkspaceContext.jsx";
import Topbar from "../../components/NavigationBars/Topbar.jsx";

const MainLayout = () => {
  return (
    <div className="flex w-full h-screen bg-[var(--bg)]">
      <SideBar />
      <div className="flex flex-1 flex-col w-full h-full text-[var(--text)]">
        <main className="flex-1 overflow-y-auto p-4">
          <Topbar />
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default MainLayout;
