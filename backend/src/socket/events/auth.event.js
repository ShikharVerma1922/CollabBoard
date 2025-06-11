function registerAuthHandler(io, socket) {
  console.log(`✅ User connected: ${socket.user?.username || socket.id}`);

  socket.on("disconnect", () => {
    console.log(`❌ User disconnected: ${socket.user?.username || socket.id}`);
  });
}

function registerWorkspaceHandler(io, socket) {
  socket.on("join-workspace", (workspaceId) => {
    socket.join(workspaceId);
    console.log(
      `🟢 ${socket.user?.username || socket.id} joined workspace ${workspaceId}`
    );
  });

  socket.on("leave-workspace", (workspaceId) => {
    socket.leave(workspaceId);
    console.log(
      `🔴 ${socket.user?.username || socket.id} left workspace ${workspaceId}`
    );
  });
}

export { registerAuthHandler, registerWorkspaceHandler };
