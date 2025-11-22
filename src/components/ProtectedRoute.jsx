import React from "react";
import { Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { toast } from "react-hot-toast";

const ProtectedRoute = ({ children, premiumOnly = false }) => {
  const { currentUser, loading } = useAuth();

  // Show loading while auth status is resolving
  if (loading) return <div className="text-center mt-20">Loading...</div>;

  // Redirect if not signed in
  if (!currentUser) {
    toast.error("You must sign in to access this page!");
    return <Navigate to="/" replace />;
  }

  // Check premium status for premium-only pages
  if (premiumOnly) {
    const now = new Date();
    const expiry = currentUser?.premiumExpiry ? new Date(currentUser.premiumExpiry) : null;

    if (!currentUser.isPremium || !expiry || expiry < now) {
      return React.cloneElement(children, { premiumExpired: true });
    }
  }

  return children;
};

export default ProtectedRoute;
