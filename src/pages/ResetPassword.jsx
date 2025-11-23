// src/pages/ResetPassword.jsx
import React, { useState } from "react";
import { useAuth } from "../context/AuthContext";
import { toast } from "react-hot-toast";

const ResetPassword = () => {
  const { resetPassword } = useAuth();
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);

  const handleReset = async () => {
    if (!email) return toast.error("Please enter your email.");
    setLoading(true);

    try {
      await resetPassword(email);
      toast.success("Password reset email sent! Check your inbox.");
      setEmail("");
    } catch (err) {
      console.error(err);
      toast.error(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-br from-purple-700 to-purple-500 text-white p-4">
      <div className="bg-white text-black p-8 rounded-xl shadow-lg max-w-md w-full text-center">
        <h1 className="text-2xl font-bold mb-4">Reset Password</h1>
        <input
          type="email"
          placeholder="Your registered email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="w-full mb-4 p-2 border rounded"
        />
        <button
          onClick={handleReset}
          disabled={loading}
          className={`w-full py-2 rounded bg-green-600 text-white font-semibold ${
            loading ? "opacity-50 cursor-not-allowed" : "hover:bg-green-700"
          }`}
        >
          {loading ? "Sending..." : "Send Reset Email"}
        </button>
      </div>
    </div>
  );
};

export default ResetPassword;
