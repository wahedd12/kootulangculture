// src/pages/Subscribe.jsx
import React from "react";
import { useAuth } from "../context/AuthContext";
import { doc, updateDoc } from "firebase/firestore";
import { db } from "../firebase/config";
import { toast } from "react-hot-toast";

const Subscribe = () => {
  const { currentUser } = useAuth();

  const handleUpgrade = async () => {
    if (!currentUser) return;
    try {
      const userRef = doc(db, "users", currentUser.uid);
      await updateDoc(userRef, { isPremium: true });
      toast.success("You are now a Premium user!");
    } catch (err) {
      console.error("Error upgrading:", err);
      toast.error("Upgrade failed. Try again.");
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-br from-purple-700 to-purple-500 text-white p-4">
      <div className="bg-white text-black p-8 rounded-xl shadow-lg max-w-lg text-center">
        <h1 className="text-3xl font-bold mb-4">Upgrade to Premium</h1>
        <p className="mb-6">
          Get full access to all Yoruba quizzes and track your progress!
        </p>
        <button
          onClick={handleUpgrade}
          className="bg-green-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-green-700 transition-all duration-300"
        >
          Upgrade Now
        </button>
      </div>
    </div>
  );
};

export default Subscribe;
