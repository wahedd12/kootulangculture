// src/pages/DemoQuiz.jsx
import React, { useState, useEffect } from "react";
import { useAuth } from "../context/AuthContext";
import { doc, getDoc, updateDoc, arrayUnion } from "firebase/firestore";
import { db } from "../firebase/config";
import { useNavigate } from "react-router-dom";
import { toast } from "react-hot-toast";

// Demo questions (4 total, mix from QuizOne & QuizTwo)
const demoQuestions = [
  { question: "What is 1 in Yoruba?", options: ["Ọkan", "Meji", "Mẹta", "Mẹrin"], answer: "Ọkan" },
  { question: "What is 2 in Yoruba?", options: ["Mẹta", "Meji", "Mẹrin", "Marun"], answer: "Meji" },
  { question: "Who is the king of Ibadan?", options: ["Olubadan", "Alaafin", "Ooni", "Deji"], answer: "Olubadan" },
  { question: "Who is the king of Oyo?", options: ["Olubadan", "Alaafin", "Ooni", "Ewi"], answer: "Alaafin" },
];

const DemoQuiz = () => {
  const { currentUser } = useAuth();
  const navigate = useNavigate();

  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedChoice, setSelectedChoice] = useState("");
  const [score, setScore] = useState(0);
  const [quizOver, setQuizOver] = useState(false);
  const [alertMsg, setAlertMsg] = useState("");

  const handleChoiceClick = (choice) => setSelectedChoice(choice);

  const displayAlert = (msg) => {
    setAlertMsg(msg);
    setTimeout(() => setAlertMsg(""), 2000);
  };

  const nextQuestion = async () => {
    if (!selectedChoice && !quizOver) {
      displayAlert("Please select an answer!");
      return;
    }

    if (!quizOver) {
      if (selectedChoice === demoQuestions[currentIndex].answer) {
        displayAlert("Correct!");
        setScore((prev) => prev + 1);
      } else {
        displayAlert(`Wrong! Correct answer: ${demoQuestions[currentIndex].answer}`);
      }
    }

    if (currentIndex + 1 < demoQuestions.length) {
      setCurrentIndex((prev) => prev + 1);
      setSelectedChoice("");
    } else {
      setQuizOver(true);
      await saveScore();
    }
  };

  const saveScore = async () => {
    if (!currentUser) return;
    try {
      const userRef = doc(db, "users", currentUser.uid);
      await updateDoc(userRef, {
        quizScores: arrayUnion({
          quiz: "DemoQuiz",
          score,
          date: new Date(),
        }),
      });
    } catch (err) {
      console.error("Error saving demo score:", err);
    }
  };

  const handleUpgrade = () => {
    toast("Upgrade to Premium to access full quizzes!");
    navigate("/subscribe");
  };

  const playAgain = () => {
    setCurrentIndex(0);
    setSelectedChoice("");
    setScore(0);
    setQuizOver(false);
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-br from-[#08203e] to-[#13e759] text-white p-4">
      <h1 className="text-4xl font-bold mb-2">Demo Quiz</h1>
      <p className="mb-4">Try this short quiz for free. Upgrade to unlock all quizzes!</p>

      {alertMsg && <div className="bg-green-700 p-2 rounded mb-4">{alertMsg}</div>}

      {!quizOver ? (
        <>
          <div className="question text-2xl mb-4">{demoQuestions[currentIndex].question}</div>
          <div className="choices flex flex-col items-center gap-2">
            {demoQuestions[currentIndex].options.map((choice) => (
              <div
                key={choice}
                className={`choice w-3/5 p-2 rounded cursor-pointer ${
                  selectedChoice === choice ? "bg-blue-600 text-white" : "bg-gray-200 text-black"
                }`}
                onClick={() => handleChoiceClick(choice)}
              >
                {choice}
              </div>
            ))}
          </div>
          <button
            onClick={nextQuestion}
            className="bg-green-700 px-4 py-2 rounded mt-4 hover:bg-green-500"
          >
            Next
          </button>
        </>
      ) : (
        <div className="text-center space-y-4 bg-white text-black p-6 rounded-xl shadow-lg w-96">
          <h2 className="text-3xl font-bold">Demo Completed!</h2>
          <p className="text-xl">You scored {score} out of {demoQuestions.length}</p>
          <button
            onClick={playAgain}
            className="bg-green-700 text-white px-4 py-2 rounded hover:bg-green-500"
          >
            Play Again
          </button>
          <button
            onClick={handleUpgrade}
            className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-purple-600"
          >
            Upgrade to Premium
          </button>
        </div>
      )}
    </div>
  );
};

export default DemoQuiz;
