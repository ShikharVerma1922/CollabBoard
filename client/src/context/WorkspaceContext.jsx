import { createContext, useState, useContext } from "react";

export const WorkspaceContext = createContext();

export const WorkspaceProvider = ({ children }) => {
  const [workspace, setWorkspace] = useState(null);
  const [board, setBoard] = useState(null);

  return (
    <WorkspaceContext.Provider
      value={{ workspace, setWorkspace, board, setBoard }}
    >
      {children}
    </WorkspaceContext.Provider>
  );
};

export const useWorkspace = () => useContext(WorkspaceContext);
