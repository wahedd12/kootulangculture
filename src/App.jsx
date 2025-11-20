import React, { useState } from "react";
import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom";
import Home from "./pages/Home";
import About from "./pages/About";
import Contact from "./pages/Contact";
import QuizOne from "./pages/QuizOne";
import QuizTwo from "./pages/QuizTwo";

const App = () => {
  const [showSignIn, setShowSignIn] = useState(false);
  const [showSignUp, setShowSignUp] = useState(false);
  const [showMobileMenu, setShowMobileMenu] = useState(false);
  const [showMobileDropdown, setShowMobileDropdown] = useState(false);

  return (
    <Router>
      <div className="min-h-screen bg-gray-50 flex flex-col">
        {/* HEADER */}
        <header className="fixed top-0 left-0 w-full bg-[#110303] text-white px-6 py-3 flex items-center justify-between z-[99] border border-black rounded-xl shadow-lg">
          <h1 className="text-xl font-bold">Kootu Lang</h1>

          {/* DESKTOP NAV */}
          <nav className="hidden md:flex items-center gap-6 relative">
            <Link to="/" className="hover:text-green-400 transition-colors duration-300">Home</Link>

            {/* Our Apps Hover Dropdown */}
            <div className="relative group">
              <span className="cursor-pointer hover:text-green-400 transition-colors duration-300">
                Our Apps
              </span>
              <div className="absolute left-0 mt-2 bg-[#110303] text-white shadow-xl rounded-xl p-3 w-48 z-20 border border-white opacity-0 scale-95 group-hover:opacity-100 group-hover:scale-100 transition-all duration-300">
                <Link
                  to="/quiz-one"
                  className="block px-3 py-2 hover:bg-green-600 rounded-md transition-colors duration-300"
                >
                  Quiz One
                </Link>
                <Link
                  to="/quiz-two"
                  className="block px-3 py-2 hover:bg-green-600 rounded-md transition-colors duration-300"
                >
                  Quiz Two
                </Link>
              </div>
            </div>

            <Link to="/about" className="hover:text-green-400 transition-colors duration-300">About Us</Link>
            <Link to="/contact" className="hover:text-green-400 transition-colors duration-300">Contact Us</Link>
          </nav>

          {/* AUTH BUTTONS DESKTOP */}
          <div className="hidden md:flex gap-3">
            <button
              onClick={() => { setShowSignIn(true); setShowSignUp(false); }}
              className="px-4 py-2 border border-green-500 text-green-400 rounded hover:bg-green-700 hover:text-white transition-all duration-300"
            >
              Sign In
            </button>
            <button
              onClick={() => { setShowSignUp(true); setShowSignIn(false); }}
              className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700 transition-all duration-300"
            >
              Sign Up
            </button>
          </div>

          {/* MOBILE MENU BUTTON */}
          <button
            className="md:hidden text-white focus:outline-none"
            onClick={() => setShowMobileMenu(!showMobileMenu)}
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              {showMobileMenu ? (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              ) : (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              )}
            </svg>
          </button>

          {/* MOBILE NAV */}
          <div
            className={`md:hidden absolute top-full left-0 w-full bg-[#110303] border-t border-black flex flex-col z-30 overflow-hidden transition-all duration-300 ${
              showMobileMenu ? "max-h-screen opacity-100" : "max-h-0 opacity-0"
            }`}
          >
            <Link to="/" className="px-4 py-2 hover:bg-green-600 transition-colors duration-300" onClick={() => setShowMobileMenu(false)}>Home</Link>

            {/* Mobile dropdown click-based */}
            <div className="relative">
              <button
                onClick={() => setShowMobileDropdown(!showMobileDropdown)}
                className="w-full text-left px-4 py-2 hover:bg-green-600 transition-colors duration-300"
              >
                Our Apps
              </button>
              <div
                className={`flex flex-col overflow-hidden transition-all duration-300 ${
                  showMobileDropdown ? "max-h-40" : "max-h-0"
                }`}
              >
                <Link
                  to="/quiz-one"
                  className="px-4 py-2 hover:bg-green-600 transition-colors duration-300"
                  onClick={() => setShowMobileMenu(false)}
                >
                  Quiz One
                </Link>
                <Link
                  to="/quiz-two"
                  className="px-4 py-2 hover:bg-green-600 transition-colors duration-300"
                  onClick={() => setShowMobileMenu(false)}
                >
                  Quiz Two
                </Link>
              </div>
            </div>

            <Link to="/about" className="px-4 py-2 hover:bg-green-600 transition-colors duration-300" onClick={() => setShowMobileMenu(false)}>About Us</Link>
            <Link to="/contact" className="px-4 py-2 hover:bg-green-600 transition-colors duration-300" onClick={() => setShowMobileMenu(false)}>Contact Us</Link>

            <div className="flex flex-col gap-2 px-4 py-2">
              <button
                onClick={() => { setShowSignIn(true); setShowSignUp(false); setShowMobileMenu(false); }}
                className="px-4 py-2 border border-green-500 text-green-400 rounded hover:bg-green-700 hover:text-white transition-all duration-300"
              >
                Sign In
              </button>
              <button
                onClick={() => { setShowSignUp(true); setShowSignIn(false); setShowMobileMenu(false); }}
                className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700 transition-all duration-300"
              >
                Sign Up
              </button>
            </div>
          </div>
        </header>

        {/* SPACER for fixed header */}
        <div className="h-20"></div>

        {/* SIGN IN MODAL */}
        {showSignIn && (
          <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-40 transition-opacity duration-300">
            <div className="bg-white p-6 rounded-lg shadow w-80 transform transition-transform duration-300 scale-100">
              <h2 className="text-xl font-bold mb-4">Sign In</h2>
              <input type="email" placeholder="Email" className="w-full mb-2 p-2 border rounded" />
              <input type="password" placeholder="Password" className="w-full mb-4 p-2 border rounded" />
              <button className="w-full bg-green-600 text-white py-2 rounded mb-2 hover:bg-green-700 transition-colors duration-300">Login</button>
              <button onClick={() => setShowSignIn(false)} className="w-full text-gray-600 hover:text-gray-800 transition-colors duration-300">Close</button>
            </div>
          </div>
        )}

        {/* SIGN UP MODAL */}
        {showSignUp && (
          <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-40 transition-opacity duration-300">
            <div className="bg-white p-6 rounded-lg shadow w-80 transform transition-transform duration-300 scale-100">
              <h2 className="text-xl font-bold mb-4">Sign Up</h2>
              <input type="text" placeholder="Full Name" className="w-full mb-2 p-2 border rounded" />
              <input type="email" placeholder="Email" className="w-full mb-2 p-2 border rounded" />
              <input type="password" placeholder="Password" className="w-full mb-4 p-2 border rounded" />
              <button className="w-full bg-green-600 text-white py-2 rounded mb-2 hover:bg-green-700 transition-colors duration-300">Create Account</button>
              <button onClick={() => setShowSignUp(false)} className="w-full text-gray-600 hover:text-gray-800 transition-colors duration-300">Close</button>
            </div>
          </div>
        )}

        {/* MAIN CONTENT */}
        <main className="flex-grow p-6">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/about" element={<About />} />
            <Route path="/contact" element={<Contact />} />
            <Route path="/quiz-one" element={<QuizOne />} />
            <Route path="/quiz-two" element={<QuizTwo />} />
          </Routes>
        </main>
      </div>
    </Router>
  );
};

export default App;
