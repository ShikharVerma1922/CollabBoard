import dotenv from "dotenv";
dotenv.config();

import { initApp } from "./app.js";
import connectDB from "./db/index.js";
import { createServer } from "http";
import { initSocket } from "./socket/index.js";

connectDB()
  .then(() => {
    const server = createServer(); // Create HTTP server without app yet
    const io = initSocket(server); // Initialize socket.io with server
    const app = initApp(io); // Pass io into app initializer to attach middleware
    server.on("request", app); // Attach express app as request handler

    server.listen(process.env.PORT || 3000, () => {
      console.log(`✅ Server running on port ${process.env.PORT || 3000}`);
    });
  })
  .catch((err) => {
    console.log("Error starting the server", err);
  });
