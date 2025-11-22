// src/pages/QuizTwo.jsx
import React, { useState, useEffect } from "react";
import { useAuth } from "../context/AuthContext";
import { doc, getDoc, updateDoc, arrayUnion } from "firebase/firestore";
import { db } from "../firebase/config";
import { toast } from "react-hot-toast";

// Towns / Kings Quiz
const townsQuestions = [
  { question: "Who is the king of Ibadan?", options: ["Olubadan", "Alaafin", "Ooni", "Deji"], answer: "Olubadan" },
  { question: "Who is the king of Oyo?", options: ["Olubadan", "Alaafin", "Ooni", "Ewi"], answer: "Alaafin" },
  { question: "Who is the king of Abeokuta?", options: ["Alake", "Olubadan", "Osemawe", "Deji"], answer: "Alake" },
  { question: "Who is the king of Ile-Ife?", options: ["Ooni", "Alake", "Ewi", "Olubadan"], answer: "Ooni" },
  { question: "Who is the king of Lagos?", options: ["Oba of Lagos", "Alaafin", "Ooni", "Olubadan"], answer: "Oba of Lagos" },
  { question: "Who is the king of Benin?", options: ["Oba of Benin", "Olubadan", "Alaafin", "Ooni"], answer: "Oba of Benin" },
  { question: "Who is the king of Akure?", options: ["Deji", "Olubadan", "Ooni", "Alaafin"], answer: "Deji" },
  { question: "Who is the king of Ijebu-Ode?", options: ["Awujale", "Olubadan", "Ooni", "Alaafin"], answer: "Awujale" },
];

const shuffleArray = (array) => array.sort(() => 0.5 - Math.random());

const QuizTwo = () => {
  const { currentUser } = useAuth();

  const [questions, setQuestions] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedChoice, setSelectedChoice] = useState("");
  const [score, setScore] = useState(0);
  const [quizOver, setQuizOver] = useState(false);
  const [alertMsg, setAlertMsg] = useState("");

  useEffect(() => {
    setQuestions(shuffleArray(townsQuestions));
  }, []);

  const handleChoiceClick = (choice) => setSelectedChoice(choice);

  const displayAlert = (msg) => {
    setAlertMsg(msg);
    setTimeout(() => setAlertMsg(""), 2000);
  };

  const nextQuestion = async () => {
    if (!selectedChoice) {
      displayAlert("Please select an answer!");
      return;
    }

    if (selectedChoice === questions[currentIndex].answer) {
      displayAlert("Correct!");
      setScore((prev) => prev + 1);
    } else {
      displayAlert(`Wrong! Correct answer: ${questions[currentIndex].answer}`);
    }

    if (currentIndex + 1 < questions.length) {
      setCurrentIndex((prev) => prev + 1);
      setSelectedChoice("");
    } else {
      setQuizOver(true);
      if (currentUser) {
        try {
          const userRef = doc(db, "users", currentUser.uid);
          await updateDoc(userRef, {
            quizScores: arrayUnion({
              quiz: "QuizTwo",
              score,
              date: new Date(),
            }),
          });
        } catch (err) {
          console.error("Error saving score:", err);
        }
      }
    }
  };

  const playAgain = () => {
    setCurrentIndex(0);
    setSelectedChoice("");
    setScore(0);
    setQuizOver(false);
    setQuestions(shuffleArray(townsQuestions));
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-br from-[#08203e] to-[#13e759] text-white p-4">
      <h1 className="text-4xl font-bold mb-2">Towns & Kings Quiz</h1>

      {alertMsg && <div className="bg-green-700 p-2 rounded mb-4">{alertMsg}</div>}

      {!quizOver ? (
        <>
          <div className="question text-2xl mb-4">{questions[currentIndex]?.question}</div>
          <div className="choices flex flex-col items-center gap-3 w-full md:w-3/5">
            {questions[currentIndex]?.options.map((choice) => (
              <div
                key={choice}
                className={`choice w-full p-3 rounded-lg cursor-pointer text-center font-medium shadow-sm transition-all duration-200 border ${
                  selectedChoice === choice
                    ? "bg-blue-600 text-white border-blue-700"
                    : "bg-white text-gray-800 border-gray-300 hover:bg-gray-100"
                }`}
                onClick={() => handleChoiceClick(choice)}
              >
                {choice}
              </div>
            ))}
          </div>
          <button
            onClick={nextQuestion}
            className="bg-green-700 px-4 py-2 rounded mt-4 hover:bg-green-500 transition-colors duration-200"
          >
            Next
          </button>
        </>
      ) : (
        <div className="text-center space-y-4 bg-white text-black p-6 rounded-xl shadow-lg w-96">
          <h2 className="text-3xl font-bold">Quiz Completed!</h2>
          <p className="text-xl">You scored {score} out of {questions.length}</p>
          <button
            onClick={playAgain}
            className="bg-green-700 text-white px-4 py-2 rounded hover:bg-green-500 transition-colors duration-200"
          >
            Play Again
          </button>
        </div>
      )}
    </div>
  );
};

export default QuizTwo;
