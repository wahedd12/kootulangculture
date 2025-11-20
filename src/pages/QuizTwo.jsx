import React, { useState, useEffect } from "react";

const quizData = [
  {
    question: "Q1. Who is the traditional ruler of Ibadan?",
    choices: ["Olubadan", "Alaafin", "Oba of Lagos", "Ooni of Ife"],
    answer: "Olubadan",
  },
  {
    question: "Q2. Who rules Lagos?",
    choices: ["Olubadan", "Alaafin", "Oba of Lagos", "Ooni of Ife"],
    answer: "Oba of Lagos",
  },
  {
    question: "Q3. Who is the Alaafin of Oyo?",
    choices: ["Ooni of Ife", "Alaafin", "Oba of Lagos", "Olubadan"],
    answer: "Alaafin",
  },
  {
    question: "Q4. Who is the traditional ruler of Ife?",
    choices: ["Ooni of Ife", "Alaafin", "Oba of Lagos", "Olubadan"],
    answer: "Ooni of Ife",
  },
  {
    question: "Q5. Who rules in Ede?",
    choices: ["Oba of Ede", "Olubadan", "Alaafin", "Ooni of Ife"],
    answer: "Oba of Ede",
  },
  {
    question: "Q6. Who is the traditional ruler in Abeokuta?",
    choices: ["Alake", "Alaafin", "Oba of Lagos", "Ooni of Ife"],
    answer: "Alake",
  },
  {
    question: "Q7. Who rules Ile-Ife in Yoruba land?",
    choices: ["Ooni", "Olubadan", "Oba of Lagos", "Alaafin"],
    answer: "Ooni",
  },
  {
    question: "Q8. Who is the ruler of Ikere-Ekiti?",
    choices: ["Olukere", "Alaafin", "Oba of Lagos", "Ooni of Ife"],
    answer: "Olukere",
  },
];

const QuizTwo = () => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedChoice, setSelectedChoice] = useState("");
  const [score, setScore] = useState(0);
  const [showQuiz, setShowQuiz] = useState(false);
  const [alertMsg, setAlertMsg] = useState("");
  const [timeLeft, setTimeLeft] = useState(15);
  const [quizOver, setQuizOver] = useState(false);

  // Timer Effect
  useEffect(() => {
    if (!showQuiz || quizOver) return;

    if (timeLeft === 0) {
      handleTimeUp();
      return;
    }

    const timerId = setInterval(() => {
      setTimeLeft((prev) => prev - 1);
    }, 1000);

    return () => clearInterval(timerId);
  }, [timeLeft, showQuiz, quizOver]);

  const handleTimeUp = () => {
    alert("Time Up! Moving to next question.");
    nextQuestion();
  };

  const startQuiz = () => {
    setShowQuiz(true);
    setCurrentIndex(0);
    setScore(0);
    setQuizOver(false);
    setSelectedChoice("");
    setTimeLeft(15);
  };

  const handleChoiceClick = (choice) => {
    setSelectedChoice(choice);
  };

  const displayAlert = (msg) => {
    setAlertMsg(msg);
    setTimeout(() => setAlertMsg(""), 2000);
  };

  const nextQuestion = () => {
    if (!selectedChoice && !quizOver) {
      displayAlert("Please select an answer!");
      return;
    }

    if (!quizOver) {
      if (selectedChoice === quizData[currentIndex].answer) {
        displayAlert("Correct Answer!");
        setScore((prev) => prev + 1);
      } else {
        displayAlert(
          `Wrong Answer! ${quizData[currentIndex].answer} is correct.`
        );
      }
    }

    if (currentIndex + 1 < quizData.length) {
      setCurrentIndex((prev) => prev + 1);
      setSelectedChoice("");
      setTimeLeft(15);
    } else {
      setQuizOver(true);
      displayAlert("You have completed the quiz!");
    }
  };

  const playAgain = () => {
    startQuiz();
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-br from-[#08203e] to-[#13e759] text-white p-4">
      <h1 className="text-4xl font-bold mb-2">QUIZ 2</h1>
      <h2 className="text-5xl text-blue-500 font-extrabold mb-2 hover:text-purple-600">
        TOWNS AND THEIR KINGS
      </h2>
      <p className="mb-4">Let's hold on to our heritage!</p>

      {alertMsg && (
        <div className="bg-green-700 p-2 rounded mb-4">{alertMsg}</div>
      )}

      {!showQuiz && (
        <button
          onClick={startQuiz}
          className="startBtn bg-blue-600 px-4 py-2 rounded hover:bg-purple-600 mb-4"
        >
          Start Quiz
        </button>
      )}

      {showQuiz && (
        <div className="container w-full max-w-3xl text-center space-y-4">
          <h1 className="text-3xl underline decoration-2 mb-4">
            Let's play a quiz game
          </h1>
          <div className="question text-2xl mb-4">
            {quizData[currentIndex].question}
          </div>
          <div className="choices flex flex-col items-center gap-2">
            {quizData[currentIndex].choices.map((choice) => (
              <div
                key={choice}
                className={`choice w-3/5 p-2 rounded cursor-pointer ${
                  selectedChoice === choice
                    ? "bg-blue-600 text-white"
                    : "bg-gray-200 text-black"
                }`}
                onClick={() => handleChoiceClick(choice)}
              >
                {choice}
              </div>
            ))}
          </div>

          <button
            onClick={quizOver ? playAgain : nextQuestion}
            className="nextBtn bg-green-700 px-4 py-2 rounded mt-4 hover:bg-green-500"
          >
            {quizOver ? "Play Again" : "Next"}
          </button>

          <div className="scoreCard text-xl mt-2">
            {quizOver && `You scored ${score} out of ${quizData.length}`}
          </div>

          <div className="timer text-xl mt-2 flex justify-center items-center bg-[#08203e] w-20 h-20 rounded-full border-2 border-red-500">
            {timeLeft}
          </div>
        </div>
      )}
    </div>
  );
};

export default QuizTwo;
