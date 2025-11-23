import React, { useState, useEffect } from "react";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";
import { toast } from "react-hot-toast";

// Number questions
const numberQuestions = [
  { question: "What is 1 in Yoruba?", answer: "Ọkan" },
  { question: "What is 2 in Yoruba?", answer: "Eeji" },
  { question: "What is 3 in Yoruba?", answer: "Eeta" },
  { question: "What is 4 in Yoruba?", answer: "Eerin" },
  { question: "What is 5 in Yoruba?", answer: "Arun" },
  { question: "What is 6 in Yoruba?", answer: "Efa" },
  { question: "What is 7 in Yoruba?", answer: "Eje" },
  { question: "What is 8 in Yoruba?", answer: "Ejo" },
  { question: "What is 9 in Yoruba?", answer: "Esa" },
  { question: "What is 10 in Yoruba?", answer: "Ewa" },
];

// Shuffle helper
const shuffleArray = (array) => [...array].sort(() => 0.5 - Math.random());

// Generate multiple-choice options
const generateOptions = (correctAnswer) => {
  const otherAnswers = numberQuestions.map(q => q.answer).filter(a => a !== correctAnswer);
  return shuffleArray([correctAnswer, ...shuffleArray(otherAnswers).slice(0, 3)]);
};

const QuizOne = ({ premiumExpired = false }) => {
  const { currentUser } = useAuth();
  const navigate = useNavigate();

  const [questions, setQuestions] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedChoice, setSelectedChoice] = useState("");
  const [score, setScore] = useState(0);
  const [quizOver, setQuizOver] = useState(false);
  const [alertMsg, setAlertMsg] = useState("");

  useEffect(() => {
    const qWithOptions = numberQuestions.map(q => ({
      ...q,
      options: generateOptions(q.answer)
    }));
    setQuestions(shuffleArray(qWithOptions));
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

    if (selectedChoice === questions[currentIndex].answer) setScore(prev => prev + 1);

    if (currentIndex + 1 < questions.length) {
      setCurrentIndex(prev => prev + 1);
      setSelectedChoice("");
    } else setQuizOver(true);
  };

  const playAgain = () => {
    const qWithOptions = numberQuestions.map(q => ({
      ...q,
      options: generateOptions(q.answer)
    }));
    setQuestions(shuffleArray(qWithOptions));
    setCurrentIndex(0);
    setSelectedChoice("");
    setScore(0);
    setQuizOver(false);
  };

  const handleUpgrade = () => {
    toast("Upgrade to Premium to access full quizzes!");
    navigate("/subscribe");
  };

  if (premiumExpired) {
    return (
      <div className="text-center space-y-4 bg-white text-black p-6 rounded-xl shadow-lg w-96 mx-auto mt-20">
        <h2 className="text-2xl font-bold">Premium Required!</h2>
        <p>Get Premium to access full quizzes.</p>
        <button onClick={handleUpgrade} className="bg-green-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-green-700 transition-all duration-300">
          Renew Premium
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
            {questions[currentIndex].options.map(choice => (
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
          <button onClick={nextQuestion} className="bg-green-700 px-6 py-2 rounded mt-4 hover:bg-green-500">Next</button>
        </>
      ) : (
        <div className="text-center space-y-4 bg-white text-black p-6 rounded-xl shadow-lg w-96">
          <h2 className="text-3xl font-bold">Quiz Completed!</h2>
          <p className="text-xl">You scored {score} out of {questions.length}</p>
          <button onClick={playAgain} className="bg-green-700 text-white px-4 py-2 rounded hover:bg-green-500">Play Again</button>
        </div>
      )}
    </div>
  );
};

export default QuizOne;
