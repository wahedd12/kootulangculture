// src/components/ProtectedRoute.jsx
import React from "react";
import { Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { toast } from "react-hot-toast";

const ProtectedRoute = ({ children }) => {
  const { currentUser } = useAuth();

  if (!currentUser) {
    toast.error("You must sign in to access this page!");
    return <Navigate to="/" replace />;
  }

  return children;
};

export default ProtectedRoute;
