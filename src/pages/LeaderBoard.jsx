// src/pages/Leaderboard.jsx
import React, { useEffect, useState } from "react";
import { db } from "../firebase/config";
import { doc, getDoc } from "firebase/firestore";
import { useAuth } from "../context/AuthContext";

const Leaderboard = () => {
  const { currentUser } = useAuth();
  const [quizScores, setQuizScores] = useState([]);

  useEffect(() => {
    const fetchScores = async () => {
      if (!currentUser) return;

      try {
        const userRef = doc(db, "users", currentUser.uid);
        const snap = await getDoc(userRef);

        if (snap.exists()) {
          setQuizScores(snap.data()?.quizScores || []);
        }
      } catch (err) {
        console.error("Error fetching quiz scores:", err);
      }
    };

    fetchScores();
  }, [currentUser]);

  const getGrade = (score, total) => {
    const percent = (score / total) * 100;
    if (percent >= 80) return "Excellent";
    if (percent >= 60) return "Good";
    if (percent >= 40) return "Average";
    return "Poor";
  };

  return (
    <div className="min-h-screen p-4 bg-gradient-to-br from-[#08203e] to-[#13e759] text-white">
      <h1 className="text-3xl font-bold mb-4">Your Quiz History</h1>

      {quizScores.length === 0 ? (
        <p>No quiz results yet.</p>
      ) : (
        <table className="w-full bg-white text-black rounded-xl shadow-xl overflow-hidden">
          <thead className="bg-gray-200">
            <tr>
              <th className="px-4 py-2">Quiz</th>
              <th className="px-4 py-2">Date</th>
              <th className="px-4 py-2">Score</th>
              <th className="px-4 py-2">Total</th>
              <th className="px-4 py-2">Grade</th>
            </tr>
          </thead>

          <tbody>
            {quizScores.map((res, idx) => {
              const totalQuestions = res.totalQuestions || 4; // default demo quiz total
              return (
                <tr key={idx} className="text-center border-b">
                  <td className="px-4 py-2">{res.quiz}</td>
                  <td className="px-4 py-2">{res.date?.toDate().toLocaleString()}</td>
                  <td className="px-4 py-2">{res.score}</td>
                  <td className="px-4 py-2">{totalQuestions}</td>
                  <td className="px-4 py-2">{getGrade(res.score, totalQuestions)}</td>
                </tr>
              );
            })}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default Leaderboard;
