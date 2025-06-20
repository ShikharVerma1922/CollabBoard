import React from "react";
import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "../context/authContext";

const ProtectedRoute = () => {
  const { user, loadingUser } = useAuth();

  if (loadingUser) return null;

  return user ? <Outlet /> : <Navigate to="/login" replace />;
};

export default ProtectedRoute;
