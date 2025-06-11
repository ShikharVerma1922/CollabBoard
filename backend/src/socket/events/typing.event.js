function registerTypingHandlers(io, socket) {
  let lastTypingRoomId = null;

  socket.on("typing", ({ boardId, workspaceId }) => {
    const roomId = boardId || workspaceId;
    if (roomId) {
      lastTypingRoomId = roomId;
      socket.to(roomId).emit("user-typing", {
        userId: socket.user._id,
        username: socket.user.username,
        boardId,
        workspaceId,
      });
    }
  });

  socket.on("stop-typing", ({ boardId, workspaceId }) => {
    const roomId = boardId || workspaceId;
    if (roomId) {
      lastTypingRoomId = null;
      socket.to(roomId).emit("user-stop-typing", {
        userId: socket.user._id,
        boardId,
        workspaceId,
      });
    }
  });

  socket.on("disconnect", () => {
    if (lastTypingRoomId) {
      socket.to(lastTypingRoomId).emit("user-stop-typing", {
        userId: socket.user._id,
      });
    }
  });
}

export { registerTypingHandlers };
