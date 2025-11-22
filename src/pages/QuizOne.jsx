// src/pages/QuizOne.jsx
import React, { useState, useEffect } from "react";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";
import { toast } from "react-hot-toast";

// Non-linear Yoruba numbers sequence
const numberSequence = [
  { num: 1, yoruba: "Ọkan" },
  { num: 5, yoruba: "Aarun" },
  { num: 8, yoruba: "Eeta" },
  { num: 16, yoruba: "Odogun" },
  { num: 21, yoruba: "Ogúnlá" },
  { num: 30, yoruba: "Ọgbọ̀n" },
  { num: 42, yoruba: "Ogójì" },
  { num: 55, yoruba: "Àádọ́ta" },
  { num: 68, yoruba: "Ọgọ́rùn-ún-dín-lọ́gọ́ta" },
  { num: 100, yoruba: "Ọgọrun" },
];

// Helper to shuffle options
const shuffleOptions = (options) => [...options].sort(() => 0.5 - Math.random());

// Generate questions
const numberQuestions = numberSequence.map((item) => ({
  question: `What is ${item.num} in Yoruba?`,
  answer: item.yoruba,
  options: shuffleOptions([
    item.yoruba,
    ...shuffleOptions(numberSequence.map(n => n.yoruba).filter(y => y !== item.yoruba)).slice(0, 3)
  ])
}));

const QuizOne = () => {
  const { currentUser } = useAuth();
  const navigate = useNavigate();

  const [questions, setQuestions] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedChoice, setSelectedChoice] = useState("");
  const [score, setScore] = useState(0);
  const [quizOver, setQuizOver] = useState(false);
  const [alertMsg, setAlertMsg] = useState("");

  useEffect(() => setQuestions(numberQuestions), []);

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
      setScore(prev => prev + 1);
      displayAlert("Correct!");
    } else {
      displayAlert(`Wrong! Correct answer: ${questions[currentIndex].answer}`);
    }

    if (currentIndex + 1 < questions.length) {
      setCurrentIndex(prev => prev + 1);
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
    setQuestions(numberQuestions);
  };

  const handleUpgrade = () => {
    toast("Upgrade to Premium to access full quizzes!");
    navigate("/subscribe");
  };

  // Premium check
  const now = new Date();
  const expiry = currentUser?.premiumExpiry ? new Date(currentUser.premiumExpiry) : null;
  if (!currentUser?.isPremium || !expiry || expiry < now) {
    return (
      <div className="text-center space-y-4 bg-white text-black p-6 rounded-xl shadow-lg w-96 mx-auto mt-20">
        <h2 className="text-2xl font-bold">Premium Required!</h2>
        <p>You need Premium access to play this quiz.</p>
        <button
          onClick={handleUpgrade}
          className="bg-green-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-green-700 transition-all duration-300"
        >
          Upgrade Now
        </button>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-br from-[#08203e] to-[#13e759] text-white p-4">
      <h1 className="text-4xl font-bold mb-2">Quiz One: Yoruba Numbers</h1>
      {questions.length > 0 && <p className="mb-4">Question {currentIndex + 1} of {questions.length}</p>}
      {alertMsg && <div className="bg-green-500 p-2 rounded mb-4">{alertMsg}</div>}

      {!quizOver && questions.length > 0 ? (
        <>
          <div className="question text-2xl mb-4">{questions[currentIndex].question}</div>
          <div className="choices flex flex-col items-center gap-2 w-full md:w-3/5">
            {questions[currentIndex].options.map((choice) => (
              <div
                key={choice}
                className={`choice w-full p-3 rounded-lg cursor-pointer text-center border border-gray-300 hover:bg-gray-200 hover:text-black transition-all duration-300 ${
                  selectedChoice === choice ? "bg-blue-600 text-white border-blue-700" : "bg-white text-black"
                }`}
                onClick={() => handleChoiceClick(choice)}
              >
                {choice}
              </div>
            ))}
          </div>
          <button
            onClick={nextQuestion}
            className="bg-green-700 px-6 py-2 rounded mt-4 hover:bg-green-500"
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
            className="bg-green-700 text-white px-4 py-2 rounded hover:bg-green-500"
          >
            Play Again
          </button>
        </div>
      )}
    </div>
  );
};

export default QuizOne;
