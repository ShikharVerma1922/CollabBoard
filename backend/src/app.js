import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import { errorHandler } from "./middlewares/error.middleware.js";

// import routes
import authRoutes from "./routes/auth.route.js";
import workspaceRoutes from "./routes/workspace.route.js";
import boardRoutes from "./routes/board.route.js";
import columnRoutes from "./routes/column.route.js";
import taskRoutes from "./routes/task.route.js";
import messageRoutes from "./routes/message.route.js";
import commentRoutes from "./routes/comment.route.js";
import activityRoutes from "./routes/activites.route.js";
import { attachIO } from "./middlewares/attachIO.middleware.js";

function initApp(io) {
  const app = express();

  const allowedOrigins = process.env.CORS_ORIGIN.split(",");

  app.use(
    cors({
      origin: function (origin, callback) {
        if (!origin || allowedOrigins.includes(origin)) {
          callback(null, true);
        } else {
          callback(new Error("Not allowed by CORS"));
        }
      },
      credentials: true,
    })
  );
  app.use(express.json({ limit: "16kb" }));
  app.use(express.urlencoded({ extended: true, limit: "16kb" }));
  app.use(express.static("public"));
  app.use(cookieParser());
  //attach IO middleware
  app.use(attachIO(io));

  app.use("/api/v1/users", authRoutes);
  app.use("/api/v1/workspaces", workspaceRoutes);
  app.use("/api/v1/workspaces/:workspaceId/boards", boardRoutes);
  app.use(
    "/api/v1/workspaces/:workspaceId/boards/:boardId/columns",
    columnRoutes
  );
  app.use(
    "/api/v1/workspaces/:workspaceId/boards/:boardId/columns/:columnId/tasks",
    taskRoutes
  );
  app.use("/api/v1/workspaces/:workspaceId/messages", messageRoutes);
  app.use(
    "/api/v1/workspaces/:workspaceId/boards/:boardId/columns/:columnId/tasks/:taskId/comments",
    commentRoutes
  );
  app.use("/api/v1/workspaces/:workspaceId/activities", activityRoutes);

  // error handling middleware
  app.use(errorHandler);

  return app;
}

export { initApp };
