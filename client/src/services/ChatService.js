import axios from "axios";

async function fetchMessages(workspaceId, page) {
  try {
    const res = await axios.get(
      `${
        import.meta.env.VITE_SERVER
      }/workspaces/${workspaceId}/messages?page=${page}`,
      { withCredentials: true }
    );
    return res.data.data?.processedMessages || [];
  } catch (error) {
    console.log(error);
    return [];
  }
}

const markMessagesAsRead = async (workspaceId) => {
  try {
    await axios.patch(
      `${
        import.meta.env.VITE_SERVER
      }/workspaces/${workspaceId}/messages/mark-read`,
      {},
      { withCredentials: true }
    );
  } catch (err) {
    console.error("Error marking messages as read:", err);
  }
};

export { fetchMessages, markMessagesAsRead };
