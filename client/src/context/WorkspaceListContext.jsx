import { createContext, useState, useContext } from "react";

export const WorkspaceListContext = createContext();

export const WorkspaceListProvider = ({ children }) => {
  const [workspaceList, setWorkspaceList] = useState([]);

  return (
    <WorkspaceListContext.Provider value={{ workspaceList, setWorkspaceList }}>
      {children}
    </WorkspaceListContext.Provider>
  );
};

export const useWorkspaceList = () => useContext(WorkspaceListContext);
