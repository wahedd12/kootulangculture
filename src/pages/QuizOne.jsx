// src/pages/QuizOne.jsx
import React, { useState, useEffect } from "react";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";

// Yoruba Numbers Quiz 10 questions randomized
const numberQuestions = [
  { number: 1, answer: "Ọkan" },
  { number: 2, answer: "Eeji" },
  { number: 3, answer: "Mẹta" },
  { number: 4, answer: "Mẹrin" },
  { number: 5, answer: "Marun" },
  { number: 6, answer: "Mẹfa" },
  { number: 7, answer: "Meje" },
  { number: 8, answer: "Mẹjọ" },
  { number: 9, answer: "Mẹsan" },
  { number: 10, answer: "Mẹwa" },
];

const shuffleArray = (array) => array.sort(() => 0.5 - Math.random());

const QuizOne = ({ premiumExpired }) => {
  const navigate = useNavigate();
  const [questions, setQuestions] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedChoice, setSelectedChoice] = useState("");
  const [score, setScore] = useState(0);
  const [quizOver, setQuizOver] = useState(false);
  const [alertMsg, setAlertMsg] = useState("");

  useEffect(() => {
    setQuestions(shuffleArray(numberQuestions).slice(0, 10).map(q => {
      const options = shuffleArray([q.answer, "Ọkan", "Eeji", "Mẹta", "Mẹrin"]).slice(0,4);
      if (!options.includes(q.answer)) options[0] = q.answer;
      return {...q, options: shuffleArray(options)};
    }));
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
      setScore(prev => prev + 1);
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
    setQuestions(shuffleArray(numberQuestions).slice(0, 10).map(q => {
      const options = shuffleArray([q.answer, "Ọkan", "Eeji", "Mẹta", "Mẹrin"]).slice(0,4);
      if (!options.includes(q.answer)) options[0] = q.answer;
      return {...q, options: shuffleArray(options)};
    }));
  };

  if (premiumExpired) {
    return (
      <div className="text-center space-y-4 bg-white text-black p-6 rounded-xl shadow-lg w-96 mx-auto mt-20">
        <h2 className="text-2xl font-bold">Premium Required!</h2>
        <p>Your Premium access has expired. Renew to continue full quizzes.</p>
        <button
          onClick={() => navigate("/subscribe")}
          className="bg-green-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-green-700 transition-all duration-300"
        >
          Renew Premium
        </button>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-br from-[#08203e] to-[#13e759] text-white p-4">
      <h1 className="text-4xl font-bold mb-2">Quiz One</h1>
      <p className="mb-4">Learn Yoruba Numbers!</p>

      {alertMsg && <div className="bg-green-700 p-2 rounded mb-4">{alertMsg}</div>}

      {!quizOver && questions.length > 0 ? (
        <>
          <div className="question text-2xl mb-4">What is {questions[currentIndex].number} in Yoruba?</div>
          <div className="choices flex flex-col items-center gap-2">
            {questions[currentIndex].options.map(choice => (
              <div
                key={choice}
                className={`choice w-full md:w-3/5 p-2 rounded cursor-pointer text-center ${
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
