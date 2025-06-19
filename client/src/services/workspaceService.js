import axios from "axios";

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

export { fetchWorkspaces };
