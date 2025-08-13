import { registerUser } from "../services/authService.js";

// hooks/useSignup.js
export const useSignup = ({ setError, navigate, setLoading }) => {
  return async (data) => {
    const { username, email, password, fullName } = data;
    setLoading(true);

    try {
      await registerUser({ username, email, password, fullName });
      navigate("/login");
    } catch (err) {
      const message = err.response?.data?.message || "Signup failed";
      if (message.includes("Username")) {
        setError("username", { type: "manual", message });
      } else if (message.includes("Email")) {
        setError("email", { type: "manual", message });
      } else if (message.includes("Fullname")) {
        setError("fullName", { type: "manual", message });
      } else {
        alert(message);
      }
    } finally {
      setLoading(false);
    }
  };
};
