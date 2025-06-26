import jwt from "jsonwebtoken";
import { Server } from "socket.io";
import {
  registerAuthHandler,
  registerWorkspaceHandler,
} from "./events/auth.event.js";
import { registerBoardHandlers } from "./events/board.event.js";
import { registerTypingHandlers } from "./events/typing.event.js";

let io;

export const initSocket = (server) => {
  console.log("Socket.io server initializing...");
  io = new Server(server, {
    cors: {
      origin: process.env.CORS_ORIGIN || "http://localhost:5173",
      credentials: true,
    },
  });

  io.use((socket, next) => {
    const cookieHeader = socket.handshake.headers.cookie;
    console.log("Socket handshake cookies:", cookieHeader);

    const accessToken = cookieHeader
      ?.split("; ")
      .find((row) => row.startsWith("accessToken="))
      ?.split("=")[1];

    if (!accessToken) {
      console.log("No accessToken found in cookies!");
      return next(new Error("Unauthorized access"));
    }

    try {
      const decoded = jwt.verify(accessToken, process.env.ACCESS_TOKEN_SECRET);
      socket.user = decoded;
      next();
    } catch (error) {
      console.log("JWT verification failed:", error.message);
      return next(new Error("Invalid token"));
    }
  });

  io.on("connection", (socket) => {
    console.log("Socket connected:", socket.id);
    // Register event handlers only after successful authentication
    registerAuthHandler(io, socket);
    registerWorkspaceHandler(io, socket);
    registerBoardHandlers(io, socket);
    registerTypingHandlers(io, socket);
  });

  return io;
};
