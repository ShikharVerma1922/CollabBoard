import axios from "axios";
import socket from "./socket.js";

export const getCurrentUser = async () => {
  const res = await axios.get("http://localhost:3000/api/v1/users/me", {
    withCredentials: true, // crucial for cookie auth
  });

  if (res.data.success) {
    // ✅ Connect socket AFTER cookie is set
    setTimeout(() => {
      socket.connect();
      socket.on("connect", () => {
        console.log("✅ Socket connected! ID:", socket.id);
      });
      socket.on("connect_error", (err) => {
        console.error("❌ Socket connection error:", err.message);
      });
    }, 150); // Wait for cookie to be set
  }

  return res.data.data.user;
};

export const registerUser = async ({ username, email, password }) => {
  const res = await axios.post(
    "http://localhost:3000/api/v1/users/register",
    { username, email, password },
    { withCredentials: true }
  );

  return res.data;
};

export const loginUser = async ({ usernameOrEmail, password }) => {
  const res = await axios.post(
    "http://localhost:3000/api/v1/users/login",
    {
      username: usernameOrEmail,
      email: usernameOrEmail,
      password,
    },
    { withCredentials: true }
  );
  console.log(res.data.success);
  if (res.data.success) {
    // ✅ Connect socket AFTER cookie is set
    setTimeout(() => {
      socket.connect();
      socket.on("connect", () => {
        console.log("✅ Socket connected! ID:", socket.id);
      });
      socket.on("connect_error", (err) => {
        console.error("❌ Socket connection error:", err.message);
      });
    }, 150); // Wait for cookie to be set
  }
  return res.data.data.user;
};
