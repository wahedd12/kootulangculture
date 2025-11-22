// src/pages/DemoQuiz.jsx
import React, { useState, useEffect } from "react";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";
import { toast } from "react-hot-toast";

// Yoruba numbers and towns quiz
const numberQuestions = [
  { question: "What is 1 in Yoruba?", options: ["Ọkan", "Eeji", "Eeta", "Eerin"], answer: "Ọkan" },
  { question: "What is 2 in Yoruba?", options: ["Eeji", "Ọkan", "Eeta", "Eerin"], answer: "Eeji" },
  { question: "What is 3 in Yoruba?", options: ["Eeta", "Eeji", "Ọkan", "Eerin"], answer: "Eeta" },
  { question: "What is 4 in Yoruba?", options: ["Eerin", "Eeta", "Eeji", "Ọkan"], answer: "Eerin" },
  { question: "What is 5 in Yoruba?", options: ["Aarun", "Eefa", "Eje", "Ejo"], answer: "Aarun" },
  { question: "What is 6 in Yoruba?", options: ["Eefa", "Aarun", "Eje", "Ejo"], answer: "Eefa" },
  { question: "What is 7 in Yoruba?", options: ["Eje", "Aarun", "Eefa", "Ejo"], answer: "Eje" },
  { question: "What is 8 in Yoruba?", options: ["Ejo", "Aarun", "Eefa", "Eje"], answer: "Ejo" },
];

const townsQuestions = [
  { question: "Who is the king of Ibadan?", options: ["Olubadan", "Alaafin", "Ooni", "Deji"], answer: "Olubadan" },
  { question: "Who is the king of Oyo?", options: ["Alaafin", "Olubadan", "Ooni", "Ewi"], answer: "Alaafin" },
  { question: "Who is the king of Abeokuta?", options: ["Alake", "Olubadan", "Osemawe", "Deji"], answer: "Alake" },
  { question: "Who is the king of Ile-Ife?", options: ["Ooni", "Alake", "Ewi", "Olubadan"], answer: "Ooni" },
];

const shuffleArray = (array) => array.sort(() => 0.5 - Math.random());

const DemoQuiz = ({ premiumExpired }) => {
  const { currentUser } = useAuth();
  const navigate = useNavigate();

  const [questions, setQuestions] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedChoice, setSelectedChoice] = useState("");
  const [score, setScore] = useState(0);
  const [quizOver, setQuizOver] = useState(false);
  const [alertMsg, setAlertMsg] = useState("");

  useEffect(() => {
    // Mix number + towns and shuffle
    setQuestions(shuffleArray([...numberQuestions, ...townsQuestions]));
  }, []);

  const handleChoiceClick = (choice) => setSelectedChoice(choice);

  const displayAlert = (msg) => {
    setAlertMsg(msg);
    setTimeout(() => setAlertMsg(""), 2000);
  };

  const nextQuestion = () => {
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
    }
  };

  const playAgain = () => {
    setCurrentIndex(0);
    setSelectedChoice("");
    setScore(0);
    setQuizOver(false);
    setQuestions(shuffleArray([...numberQuestions, ...townsQuestions]));
  };

  const handleUpgrade = () => {
    toast("Upgrade to Premium to access full quizzes!");
    navigate("/subscribe");
  };

  if (premiumExpired) {
    return (
      <div className="text-center space-y-4 bg-white text-black p-6 rounded-xl shadow-lg w-96 mx-auto mt-20">
        <h2 className="text-2xl font-bold">Premium Required!</h2>
        <p>Your Premium access has expired. Renew to continue full quizzes.</p>
        <button
          onClick={handleUpgrade}
          className="bg-green-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-green-700 transition-all duration-300"
        >
          Renew Premium
        </button>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-br from-[#08203e] to-[#13e759] text-white p-4">
      <h1 className="text-4xl font-bold mb-2">Demo Quiz</h1>
      <p className="mb-4">Try this short quiz for free. Upgrade to unlock all quizzes!</p>

      {alertMsg && <div className="bg-green-700 p-2 rounded mb-4">{alertMsg}</div>}

      {!quizOver ? (
        <>
          <div className="question text-2xl mb-4">{questions[currentIndex].question}</div>
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
          <h2 className="text-3xl font-bold">Demo Completed!</h2>
          <p className="text-xl">You scored {score} out of {questions.length}</p>
          <button
            onClick={playAgain}
            className="bg-green-700 text-white px-4 py-2 rounded hover:bg-green-500 transition-colors duration-200"
          >
            Play Again
          </button>
          <button
            onClick={handleUpgrade}
            className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-purple-600 transition-colors duration-200"
          >
            Upgrade to Premium
          </button>
        </div>
      )}
    </div>
  );
};

export default DemoQuiz;
