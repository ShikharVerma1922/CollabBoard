// src/hooks/useLogin.jsx
import { loginUser } from "../services/authService.js";
import socket from "../services/socket.js";

export const useLogin = ({
  setUser,
  setError,

  navigate,
  setLoading,
}) => {
  return async (data) => {
    const { usernameOrEmail, password } = data;

    if (usernameOrEmail?.trim() === "") {
      setError("usernameOrEmail", {
        type: "manual",
        message: "Username or Email is required",
      });
      return;
    }

    setLoading(true);

    try {
      const userData = await loginUser({ usernameOrEmail, password });

      setUser(userData);
      console.log("User logged in successfully");

      navigate("/app");
    } catch (err) {
      if (err.response && err.response.data) {
        const message = err.response?.data?.message || err.response?.data;
        console.log(
          "Login failed:",
          err.response.data.message || err.response.data
        );
        if (message.includes("credentials")) {
          setError("password", { type: "manual", message });
        } else if (message.includes("exists")) {
          setError("usernameOrEmail", { type: "manual", message });
        } else {
          alert(message);
        }
      } else {
        console.error("Unexpected error:", err);
      }
    } finally {
      setLoading(false);
    }
  };
};
