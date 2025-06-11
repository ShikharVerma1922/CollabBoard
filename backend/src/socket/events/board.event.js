function registerBoardHandlers(io, socket) {
  socket.on("join-board", (boardId) => {
    socket.join(boardId);
    console.log(`🟦 ${socket.user?.username} joined board ${boardId}`);
  });

  socket.on("leave-board", (boardId) => {
    socket.leave(boardId);
    console.log(`⬜️ ${socket.user?.username} left board ${boardId}`);
  });
}

export { registerBoardHandlers };
