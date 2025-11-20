

import React, { useEffect, useState } from "react";
import { db, auth } from "./firebase/config";
import { collection, query, where, getDocs, orderBy } from "firebase/firestore";

const Leaderboard = () => {
  const [results, setResults] = useState([]);

  useEffect(() => {
    const fetchResults = async () => {
      if (!auth.currentUser) return;

      const q = query(
        collection(db, "quizResults"),
        where("uid", "==", auth.currentUser.uid),
        orderBy("timestamp", "desc")
      );

      const snapshot = await getDocs(q);
      const data = snapshot.docs.map((doc) => doc.data());
      setResults(data);
    };

    fetchResults();
  }, []);

  return (
    <div className="min-h-screen p-4 bg-gradient-to-br from-[#08203e] to-[#13e759] text-white">
      <h1 className="text-3xl font-bold mb-4">Your Quiz History</h1>

      {results.length === 0 ? (
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
            {results.map((res, idx) => (
              <tr key={idx} className="text-center border-b">
                <td className="px-4 py-2">{res.quizName}</td>
                <td className="px-4 py-2">
                  {res.timestamp?.toDate().toLocaleString()}
                </td>
                <td className="px-4 py-2">{res.score}</td>
                <td className="px-4 py-2">{res.totalQuestions}</td>
                <td className="px-4 py-2">{res.grade}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default Leaderboard;
