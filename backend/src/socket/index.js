import jwt from "jsonwebtoken";
import { ApiError } from "../utils/ApiError.js";
import { Server } from "socket.io";
import {
  registerAuthHandler,
  registerWorkspaceHandler,
} from "./events/auth.event.js";
import { registerBoardHandlers } from "./events/board.event.js";
import { registerTypingHandlers } from "./events/typing.event.js";

let io;

export const initSocket = (server) => {
  io = new Server(server, {
    cors: {
      origin: process.env.CORS_ORIGIN,
      credentials: true,
    },
  });

  io.use((socket, next) => {
    const accessToken = socket.handshake.headers.cookie
      ?.split("; ")
      .find((row) => row.startsWith("accessToken="))
      ?.split("=")[1];

    if (!accessToken) {
      return next(new ApiError(401, "Unauthorized access"));
    }

    try {
      const decoded = jwt.verify(accessToken, process.env.ACCESS_TOKEN_SECRET);
      socket.user = decoded;
      next();
    } catch (error) {
      return next(new ApiError(401, "Invalid token"));
    }
  });

  io.on("connection", (socket) => {
    registerAuthHandler(io, socket);
    registerWorkspaceHandler(io, socket);
    registerBoardHandlers(io, socket);
    registerTypingHandlers(io, socket);
  });

  return io;
};
