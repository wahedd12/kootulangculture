// src/pages/Subscribe.jsx
import React from "react";
import { useAuth } from "../context/AuthContext";
import { doc, updateDoc } from "firebase/firestore";
import { db } from "../firebase/config";
import { toast } from "react-hot-toast";
import { PaystackButton } from "react-paystack";

const Subscribe = () => {
  const { currentUser } = useAuth();

  const handleUpgradeBackend = async () => {
    if (!currentUser) return;
    try {
      const userRef = doc(db, "users", currentUser.uid);
      const now = new Date();
      const expiry = new Date();
      expiry.setMonth(expiry.getMonth() + 1); // 1 month premium
      await updateDoc(userRef, { 
        isPremium: true,
        premiumExpiry: expiry.toISOString()
      });
      toast.success("You are now a Premium user for 1 month!");
    } catch (err) {
      console.error("Error upgrading:", err);
      toast.error("Upgrade failed. Try again.");
    }
  };

  const paystackProps = {
    email: currentUser?.email,
    amount: 5000 * 100, // 5000 NGN in kobo
    publicKey: "pk_test_77dd0b5408bb0b896b387ce76065a97c82eb7498",
    currency: "NGN",
    text: "Upgrade to Premium (₦5,000 / 1 month)",
    onSuccess: () => handleUpgradeBackend(),
    onClose: () => toast("Payment cancelled."),
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-br from-purple-700 to-purple-500 text-white p-4">
      <div className="bg-white text-black p-8 rounded-xl shadow-lg max-w-lg text-center">
        <h1 className="text-3xl font-bold mb-4">Upgrade to Premium</h1>
        <p className="mb-6">
          Get full access to all Yoruba quizzes and track your progress for 1 month!
        </p>
        <PaystackButton
          className="bg-green-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-green-700 transition-all duration-300"
          {...paystackProps}
        />
      </div>
    </div>
  );
};

export default Subscribe;
