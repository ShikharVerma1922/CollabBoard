import axios from "axios";
import { createContext, useContext, useEffect, useState } from "react";
import { getCurrentUser } from "../services/authService.js";
import { useNavigate } from "react-router-dom";

export const AuthContext = createContext({});

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loadingUser, setLoadingUser] = useState(true);
  const navigate = useNavigate();

  const logout = async () => {
    try {
      await axios.post(
        `${import.meta.env.VITE_SERVER}/users/logout`,
        {},
        { withCredentials: true }
      );
    } catch (err) {
      console.error("Logout failed:", err);
    } finally {
      setUser(null);
      localStorage.removeItem("user");
      navigate("/login");
    }
  };

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const userData = await getCurrentUser();
        setUser(userData);
      } catch (err) {
        setUser(null); // not logged in or token expired
      } finally {
        setLoadingUser(false);
      }
    };

    fetchUser();
  }, []);

  return (
    <AuthContext.Provider value={{ user, setUser, loadingUser, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
