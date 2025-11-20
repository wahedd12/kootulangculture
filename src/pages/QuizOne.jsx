import React, { useState, useEffect } from "react";
import { db } from "../firebase/config";
import { doc, setDoc, updateDoc, arrayUnion, getDoc } from "firebase/firestore";

const townsQuiz = [
  { town: "Ibadan", king: "Olubadan" },
  { town: "Oyo", king: "Alaafin" },
  { town: "Abeokuta", king: "Alake" },
  { town: "Ile-Ife", king: "Ooni" },
  { town: "Ondo", king: "Osemawe" },
  { town: "Akure", king: "Deji" },
  { town: "Saki", king: "Okere" },
  { town: "Osogbo", king: "Ataoja" },
  { town: "Ado-Ekiti", king: "Ewi" },
  { town: "Ede", king: "Oba" },
  { town: "Ikere-Ekiti", king: "Olukere" },
];

const shuffleArray = (array) => array.sort(() => 0.5 - Math.random());
const generateOptions = (correctKing, allKings) => {
  const wrongOptions = shuffleArray(allKings.filter(k => k !== correctKing)).slice(0, 3);
  return shuffleArray([...wrongOptions, correctKing]);
};
const generateQuizQuestions = () => {
  const allKings = townsQuiz.map(t => t.king);
  const randomTowns = shuffleArray(townsQuiz).slice(0, 10);
  return randomTowns.map(t => ({
    question: `Who is the king of ${t.town}?`,
    options: generateOptions(t.king, allKings),
    answer: t.king,
  }));
};

const QuizTwo = ({ currentUser }) => {
  const [quizData, setQuizData] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedChoice, setSelectedChoice] = useState("");
  const [score, setScore] = useState(0);
  const [showQuiz, setShowQuiz] = useState(false);
  const [alertMsg, setAlertMsg] = useState("");
  const [timeLeft, setTimeLeft] = useState(15);
  const [quizOver, setQuizOver] = useState(false);

  useEffect(() => {
    if (!showQuiz || quizOver) return;
    if (timeLeft === 0) {
      handleTimeUp();
      return;
    }
    const timerId = setInterval(() => setTimeLeft(prev => prev - 1), 1000);
    return () => clearInterval(timerId);
  }, [timeLeft, showQuiz, quizOver]);

  const startQuiz = () => {
    setQuizData(generateQuizQuestions());
    setShowQuiz(true);
    setCurrentIndex(0);
    setScore(0);
    setQuizOver(false);
    setSelectedChoice("");
    setTimeLeft(15);
  };

  const handleChoiceClick = choice => setSelectedChoice(choice);

  const displayAlert = msg => {
    setAlertMsg(msg);
    setTimeout(() => setAlertMsg(""), 2000);
  };

  const handleTimeUp = () => {
    displayAlert(`Time Up! Correct answer: ${quizData[currentIndex].answer}`);
    nextQuestion();
  };

  const nextQuestion = async () => {
    if (!selectedChoice && !quizOver) {
      displayAlert("Please select an answer!");
      return;
    }

    if (!quizOver) {
      if (selectedChoice === quizData[currentIndex].answer) {
        displayAlert("Correct Answer!");
        setScore(prev => prev + 1);
      } else {
        displayAlert(`Wrong! Correct answer: ${quizData[currentIndex].answer}`);
      }
    }

    if (currentIndex + 1 < quizData.length) {
      setCurrentIndex(prev => prev + 1);
      setSelectedChoice("");
      setTimeLeft(15);
    } else {
      setQuizOver(true);
      displayAlert("You have completed the quiz!");
      await saveScoreToFirestore(score + (selectedChoice === quizData[currentIndex].answer ? 1 : 0));
    }
  };

  const saveScoreToFirestore = async finalScore => {
    if (!currentUser) return;
    try {
      const userDocRef = doc(db, "users", currentUser.uid);
      const userSnapshot = await getDoc(userDocRef);
      if (userSnapshot.exists()) {
        await updateDoc(userDocRef, {
          quizScores: arrayUnion({
            quiz: "QuizTwo",
            score: finalScore,
            date: new Date(),
          }),
        });
      } else {
        await setDoc(userDocRef, {
          name: currentUser.displayName,
          email: currentUser.email,
          quizScores: [{ quiz: "QuizTwo", score: finalScore, date: new Date() }],
          createdAt: new Date(),
        });
      }
    } catch (err) {
      console.error("Error saving score:", err);
    }
  };

  const getGrade = () => {
    const percent = (score / quizData.length) * 100;
    if (percent >= 80) return "Excellent! Keep it up!";
    if (percent >= 60) return "Good result! You can improve though!";
    if (percent >= 40) return "Average, try better next time!";
    return "Poor, you need to study more!";
  };

  const playAgain = () => startQuiz();

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-br from-[#08203e] to-[#13e759] text-white p-4">
      <h1 className="text-4xl font-bold mb-2">QUIZ 1</h1>
      <h2 className="text-5xl text-blue-500 font-extrabold mb-2 hover:text-purple-600">LEARN YOUR NUMBERS</h2>
      <p className="mb-4">Let's hold on to our heritage!</p>

      {alertMsg && <div className="bg-green-700 p-2 rounded mb-4">{alertMsg}</div>}

      {!showQuiz && (
        <button
          onClick={startQuiz}
          className="bg-blue-600 px-4 py-2 rounded hover:bg-purple-600 mb-4"
        >
          Start Quiz
        </button>
      )}

      {showQuiz && quizData.length > 0 && (
        <div className="container w-full max-w-3xl text-center space-y-4">
          {!quizOver ? (
            <>
              <div className="question text-2xl mb-4">{quizData[currentIndex].question}</div>
              <div className="choices flex flex-col items-center gap-2">
                {quizData[currentIndex].options.map(choice => (
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
              <div className="timer text-xl mt-2 flex justify-center items-center bg-[#08203e] w-20 h-20 rounded-full border-2 border-red-500">
                {timeLeft}
              </div>
            </>
          ) : (
            <div className="text-center space-y-4 bg-white text-black p-6 rounded-xl shadow-lg w-96">
              <h2 className="text-3xl font-bold">Quiz Completed!</h2>
              <p className="text-xl">You scored {score} out of {quizData.length}</p>
              <p className="text-lg">{getGrade()}</p>
              <button
                onClick={playAgain}
                className="bg-green-700 text-white px-4 py-2 rounded hover:bg-green-500"
              >
                Play Again
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default QuizTwo;
