export const handleConnection = (socket) => {
  console.log(`🟢 User connected: ${socket.user.username}`);

  socket.on("disconnect", () => {
    console.log(`🔴 User disconnected: ${socket.user.username}`);
  });
};

export const handleWorkspace = (socket, io) => {};
