// src/pages/QuizOne.jsx
import { useState, useEffect } from "react";

const quizData = [
  {
    question: "Q1. What is 170 in Yoruba?",
    choices: ["ogota", "ogofa", "aadota", "aadojo"],
    answer: "aadojo",
  },
  {
    question: "Q2. What is 60 in Yoruba?",
    choices: ["ogota", "ogofa", "aadota", "aadorin"],
    answer: "ogota",
  },
  {
    question: "Q3. What is 50 in Yoruba?",
    choices: ["ogota", "ogofa", "aadota", "aadorin"],
    answer: "aadota",
  },
  {
    question: "Q4. What is 120 in Yoruba?",
    choices: ["ogota", "ogofa", "aadota", "aadorin"],
    answer: "ogofa",
  },
  {
    question: "Q5. What is 40 in Yoruba?",
    choices: ["ogota", "ogoji", "aadota", "aadorin"],
    answer: "ogoji",
  },
  {
    question: "Q6. What is 200 in Yoruba?",
    choices: ["oodurun", "ogofa", "igba", "ogorun"],
    answer: "igba",
  },
  {
    question: "Q7. What is 400 in Yoruba?",
    choices: ["egberin", "irinwo", "ogorin", "aadorin"],
    answer: "irinwo",
  },
  {
    question: "Q8. What is 800 in Yoruba?",
    choices: ["irinwo", "egberin", "aadota", "aadorin"],
    answer: "egberin",
  },
  {
    question: "Q9. What is 180 in Yoruba?",
    choices: ["ogosan", "eesan", "aadota", "aadorin"],
    answer: "ogosan",
  },
  {
    question: "Q10. What is 500 in Yoruba?",
    choices: ["ogberun", "aarun", "aadota", "eedegbeta"],
    answer: "eedegbeta",
  },
];

export default function QuizOne() {
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [score, setScore] = useState(0);
  const [quizOver, setQuizOver] = useState(false);
  const [selectedChoice, setSelectedChoice] = useState(null);
  const [timeLeft, setTimeLeft] = useState(15);
  const [showAlert, setShowAlert] = useState({ message: "", visible: false });
  const [quizStarted, setQuizStarted] = useState(false);

  // Timer effect
  useEffect(() => {
    if (!quizStarted || quizOver) return;

    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          handleTimeUp();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [quizStarted, currentQuestion, quizOver]);

  const handleTimeUp = () => {
    showTempAlert("Time's up! Moving to next question.");
    nextQuestion();
  };

  const showTempAlert = (message) => {
    setShowAlert({ message, visible: true });
    setTimeout(() => setShowAlert({ message: "", visible: false }), 2000);
  };

  const handleChoiceClick = (choice) => {
    setSelectedChoice(choice);
  };

  const checkAnswer = () => {
    if (!selectedChoice) {
      showTempAlert("Please select an answer!");
      return;
    }

    if (selectedChoice === quizData[currentQuestion].answer) {
      showTempAlert("Correct answer!");
      setScore((prev) => prev + 1);
    } else {
      showTempAlert(
        `Wrong answer! Correct: ${quizData[currentQuestion].answer}`
      );
    }

    nextQuestion();
  };

  const nextQuestion = () => {
    setSelectedChoice(null);
    if (currentQuestion + 1 < quizData.length) {
      setCurrentQuestion((prev) => prev + 1);
      setTimeLeft(15);
    } else {
      setQuizOver(true);
    }
  };

  const restartQuiz = () => {
    setCurrentQuestion(0);
    setScore(0);
    setSelectedChoice(null);
    setTimeLeft(15);
    setQuizOver(false);
    setQuizStarted(true);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-900 to-green-500 flex flex-col items-center justify-center p-4 text-white">
      <h1 className="text-4xl font-bold mb-2">QUIZ 1</h1>
      <h2 className="text-2xl text-blue-400 mb-4">NUMBERS IN YORUBA</h2>

      {!quizStarted ? (
        <button
          onClick={() => setQuizStarted(true)}
          className="bg-blue-600 hover:bg-purple-600 px-6 py-3 rounded-lg text-lg font-semibold"
        >
          Start Quiz
        </button>
      ) : quizOver ? (
        <div className="text-center">
          <h2 className="text-3xl mb-4">Quiz Completed!</h2>
          <p className="text-xl mb-4">
            Your score: {score} / {quizData.length}
          </p>
          <button
            onClick={restartQuiz}
            className="bg-green-600 hover:bg-blue-600 px-6 py-3 rounded-lg text-lg font-semibold"
          >
            Play Again
          </button>
        </div>
      ) : (
        <div className="w-full max-w-2xl bg-black/50 p-6 rounded-lg shadow-lg">
          {showAlert.visible && (
            <div className="mb-4 bg-green-600 text-white p-2 rounded">
              {showAlert.message}
            </div>
          )}

          <div className="mb-4 text-xl font-semibold">
            {quizData[currentQuestion].question}
          </div>

          <div className="grid gap-4 mb-4">
            {quizData[currentQuestion].choices.map((choice) => (
              <div
                key={choice}
                onClick={() => handleChoiceClick(choice)}
                className={`p-3 rounded cursor-pointer text-black font-semibold ${
                  selectedChoice === choice
                    ? "bg-blue-500"
                    : "bg-white/70 hover:bg-white"
                }`}
              >
                {choice}
              </div>
            ))}
          </div>

          <div className="flex justify-between items-center">
            <div className="text-lg">Time Left: {timeLeft}s</div>
            <button
              onClick={checkAnswer}
              className="bg-green-600 hover:bg-blue-600 px-4 py-2 rounded-lg font-semibold"
            >
              Next
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
