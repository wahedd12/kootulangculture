import React from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const Home = () => {
  const { currentUser } = useAuth();

  return (
    <div className="min-h-screen bg-gradient-to-b from-green-400 to-green-600 flex flex-col items-center justify-center px-6">
      <div className="max-w-2xl text-center bg-white shadow-xl p-8 rounded-2xl">
        <p className="text-lg text-gray-800 leading-relaxed">
          WaspoWorldTech is about Yoruba heritage.  
          Test yourself with our sample quizzes.
          <br />
          Register with us and discover more about the Yoruba race.
        </p>
      </div>

      {currentUser ? (
        <div className="mt-6 flex flex-col items-center gap-4">
          <Link
            to="/demo-quiz"
            className="bg-yellow-500 text-black px-6 py-3 rounded-2xl shadow-md hover:bg-yellow-600 transition-colors duration-300"
          >
            Try Demo Quiz (Free)
          </Link>
          <p className="text-white font-semibold">Log in to access full quizzes and premium content.</p>
        </div>
      ) : (
        <div className="mt-6 flex flex-col items-center gap-4">
          <p className="text-white font-semibold text-center">
            Sign up or log in to try our free Demo Quiz and explore Yoruba heritage!
          </p>
        </div>
      )}

      <div className="mt-6 bg-green-700 text-white px-6 py-3 rounded-2xl shadow-md">
        <p className="text-lg font-semibold">We are the best</p>
      </div>
    </div>
  );
};

export default Home;
