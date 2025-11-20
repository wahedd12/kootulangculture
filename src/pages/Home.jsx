import React from "react";

const Home = () => {
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

      <div className="mt-6 bg-green-700 text-white px-6 py-3 rounded-2xl shadow-md">
        <p className="text-lg font-semibold">We are the best</p>
      </div>

    </div>
  );
};

export default Home;
