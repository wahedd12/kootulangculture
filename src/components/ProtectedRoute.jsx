// src/components/ProtectedRoute.jsx
import React, { useEffect, useState } from "react";
import { Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { toast } from "react-hot-toast";
import { doc, getDoc } from "firebase/firestore";
import { db } from "../firebase/config";

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

  // Pass `premiumExpired` to children instead of redirecting
  return React.cloneElement(children, {
    premiumExpired: premiumOnly && !isPremium,
  });
};

export default ProtectedRoute;
