// src/hooks/useLogin.jsx
import { loginUser } from "../services/authService.js";

export const useLogin = ({ setUser, navigate, setLoading }) => {
  return async (data) => {
    const { usernameOrEmail, password } = data;
    setLoading(true);

    try {
      const userData = await loginUser({ usernameOrEmail, password });

      setUser(userData);
      console.log("User logged in successfully");
      navigate("/");
    } catch (err) {
      if (err.response && err.response.data) {
        console.log(
          "Login failed:",
          err.response.data.message || err.response.data
        );
      } else {
        console.error("Unexpected error:", err);
      }
    } finally {
      setLoading(false);
    }
  };
};
