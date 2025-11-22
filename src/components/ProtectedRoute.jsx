// src/components/ProtectedRoute.jsx
import React, { useEffect, useState } from "react";
import { Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { toast } from "react-hot-toast";
import { doc, getDoc } from "firebase/firestore";
import { db } from "../firebase/config";

/**
 * Props:
 * - children: the component to render
 * - premiumOnly: boolean (default false) → if true, only premium users can access
 */
const ProtectedRoute = ({ children, premiumOnly = false }) => {
  const { currentUser } = useAuth();
  const [loading, setLoading] = useState(true);
  const [isPremium, setIsPremium] = useState(false);

  useEffect(() => {
    const checkPremium = async () => {
      if (!currentUser) return setLoading(false);

      if (premiumOnly) {
        try {
          const userRef = doc(db, "users", currentUser.uid);
          const snap = await getDoc(userRef);
          const premiumStatus = snap.data()?.isPremium || false;
          setIsPremium(premiumStatus);
        } catch (err) {
          console.error("Error checking premium status:", err);
          setIsPremium(false);
        }
      }
      setLoading(false);
    };
    checkPremium();
  }, [currentUser, premiumOnly]);

  if (!currentUser) {
    toast.error("You must sign in to access this page!");
    return <Navigate to="/" replace />;
  }

  if (loading) return <div className="text-center mt-20">Loading...</div>;

  if (premiumOnly && !isPremium) {
    toast.error("This content is for Premium users only!");
    return <Navigate to="/subscribe" replace />;
  }

  return children;
};

export default ProtectedRoute;
