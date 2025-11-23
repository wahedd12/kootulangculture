// src/App.jsx
import React, { useState } from "react";
import { BrowserRouter as Router, Routes, Route, Link, Navigate, useNavigate } from "react-router-dom";
import { Toaster, toast } from "react-hot-toast";

import { AuthProvider, useAuth } from "./context/AuthContext";

import ProtectedRoute from "./components/ProtectedRoute";

import Home from "./pages/Home";
import About from "./pages/About";
import Contact from "./pages/Contact";
import QuizOne from "./pages/QuizOne";
import QuizTwo from "./pages/QuizTwo";
import DemoQuiz from "./pages/DemoQuiz";
import Subscribe from "./pages/Subscribe";
import ResetPassword from "./pages/ResetPassword";

const NavItem = ({ to, children, onClick }) => (
  <Link
    to={to}
    className="px-4 py-2 hover:bg-green-600 transition-colors duration-300 rounded"
    onClick={onClick}
  >
    {children}
  </Link>
);

const DropdownItem = ({ to, children, onClick }) => (
  <Link
    to={to}
    className="block px-3 py-2 hover:bg-green-600 rounded-md transition-colors duration-300"
    onClick={onClick}
  >
    {children}
  </Link>
);

const AppContent = () => {
  const { currentUser, signIn, signUp, signOut } = useAuth();
  const navigate = useNavigate();

  const [showSignIn, setShowSignIn] = useState(false);
  const [showSignUp, setShowSignUp] = useState(false);
  const [showMobileMenu, setShowMobileMenu] = useState(false);
  const [showMobileDropdown, setShowMobileDropdown] = useState(false);

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [error, setError] = useState("");

  const handleSignUpClick = async () => {
    try {
      await signUp(name, email, password);
      setShowSignUp(false);
      setEmail(""); setPassword(""); setName(""); setError("");
      toast.success("Sign Up Successful!");
    } catch (err) {
      setError(err.message);
    }
  };

  const handleSignInClick = async () => {
    try {
      await signIn(email, password);
      setShowSignIn(false);
      setEmail(""); setPassword(""); setError("");
      toast.success("Sign In Successful!");
    } catch (err) {
      setError(err.message);
    }
  };

  const handleLogOutClick = async () => {
    await signOut();
    toast.success("Logged Out Successfully!");
  };

  const handleForgotPassword = () => {
    setShowSignIn(false);
    setShowSignUp(false);
    navigate("/reset-password");
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      {/* HEADER */}
      <header className="fixed top-0 left-0 w-full bg-[#110303] text-white px-6 py-3 flex items-center justify-between z-[99] border border-black rounded-xl shadow-lg">
        <h1 className="text-xl font-bold">
          Kootu Lang {currentUser ? `| Welcome, ${currentUser.displayName || currentUser.email}` : ""}
        </h1>

        {/* DESKTOP NAV */}
        <nav className="hidden md:flex items-center gap-6 relative">
          <NavItem to="/">Home</NavItem>

          <div className="relative group">
            <span className={`cursor-pointer ${currentUser ? "hover:text-green-400" : "text-gray-500 cursor-not-allowed"}`}>
              Our Apps
            </span>
            {currentUser && (
              <div className="absolute left-0 mt-2 bg-[#110303] text-white shadow-xl rounded-xl p-3 w-48 z-20 border border-white opacity-0 scale-95 group-hover:opacity-100 group-hover:scale-100 transition-all duration-300">
                <DropdownItem to="/demo-quiz">Demo Quiz</DropdownItem>
                <DropdownItem to="/quiz-one">Quiz One</DropdownItem>
                <DropdownItem to="/quiz-two">Quiz Two</DropdownItem>
              </div>
            )}
          </div>

          <NavItem to="/about">About Us</NavItem>
          <NavItem to="/contact">Contact Us</NavItem>
        </nav>

        {/* AUTH BUTTONS DESKTOP */}
        <div className="hidden md:flex gap-3">
          {currentUser ? (
            <>
              <span className="px-4 py-2 text-green-400">{currentUser.displayName || currentUser.email}</span>
              <button
                onClick={handleLogOutClick}
                className="px-4 py-2 border border-red-500 text-red-400 rounded hover:bg-red-600 hover:text-white transition-all duration-300"
              >
                Log Out
              </button>
            </>
          ) : (
            <>
              <button onClick={() => { setShowSignIn(true); setShowSignUp(false); }} className="px-4 py-2 border border-green-500 text-green-400 rounded hover:bg-green-700 hover:text-white transition-all duration-300">
                Sign In
              </button>
              <button onClick={() => { setShowSignUp(true); setShowSignIn(false); }} className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700 transition-all duration-300">
                Sign Up
              </button>
            </>
          )}
        </div>

        {/* MOBILE MENU BUTTON */}
        <button className="md:hidden text-white focus:outline-none" onClick={() => setShowMobileMenu(!showMobileMenu)}>
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            {showMobileMenu ? (
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            ) : (
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            )}
          </svg>
        </button>

        {/* MOBILE NAV */}
        <div className={`md:hidden absolute top-full left-0 w-full bg-[#110303] border-t border-black flex flex-col z-30 overflow-hidden transition-all duration-300 ${showMobileMenu ? "max-h-screen opacity-100" : "max-h-0 opacity-0"}`}>
          <NavItem to="/" onClick={() => setShowMobileMenu(false)}>Home</NavItem>

          <div className="relative">
            <button
              onClick={() => setShowMobileDropdown(!showMobileDropdown)}
              className={`w-full text-left px-4 py-2 ${currentUser ? "hover:bg-green-600" : "text-gray-500 cursor-not-allowed"}`}
            >
              Our Apps
            </button>
            {currentUser && (
              <div className={`flex flex-col overflow-hidden transition-all duration-300 ${showMobileDropdown ? "max-h-52" : "max-h-0"}`}>
                <DropdownItem to="/demo-quiz" onClick={() => setShowMobileMenu(false)}>Demo Quiz</DropdownItem>
                <DropdownItem to="/quiz-one" onClick={() => setShowMobileMenu(false)}>Quiz One</DropdownItem>
                <DropdownItem to="/quiz-two" onClick={() => setShowMobileMenu(false)}>Quiz Two</DropdownItem>
              </div>
            )}
          </div>

          <NavItem to="/about" onClick={() => setShowMobileMenu(false)}>About Us</NavItem>
          <NavItem to="/contact" onClick={() => setShowMobileMenu(false)}>Contact Us</NavItem>

          {/* MOBILE AUTH LINKS */}
          {!currentUser && (
            <>
              <button onClick={() => { setShowSignIn(true); setShowMobileMenu(false); setShowSignUp(false); }} className="px-4 py-2 hover:bg-green-600 transition-colors duration-300 rounded text-left">
                Sign In
              </button>
              <button onClick={() => { setShowSignUp(true); setShowMobileMenu(false); setShowSignIn(false); }} className="px-4 py-2 hover:bg-green-600 transition-colors duration-300 rounded text-left">
                Sign Up
              </button>
              <button onClick={() => { handleForgotPassword(); setShowMobileMenu(false); }} className="px-4 py-2 hover:bg-blue-600 transition-colors duration-300 rounded text-left">
                Reset Password
              </button>
            </>
          )}
        </div>
      </header>

      <div className="h-20"></div>

      {/* SIGN IN / SIGN UP MODALS */}
      {showSignIn && (
        <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-40">
          <div className="bg-white p-6 rounded-lg shadow w-80">
            <h2 className="text-xl font-bold mb-4">Sign In</h2>
            <input type="email" placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} className="w-full mb-2 p-2 border rounded"/>
            <input type="password" placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)} className="w-full mb-2 p-2 border rounded"/>
            {error && <p className="text-red-500 mb-2">{error}</p>}

            <button onClick={handleSignInClick} className="w-full bg-green-600 text-white py-2 rounded mb-2 hover:bg-green-700 transition-colors duration-300">Login</button>
            <button onClick={handleForgotPassword} className="w-full text-blue-600 underline mb-2 hover:text-blue-800 transition-colors duration-300">
              Forgot Password?
            </button>
            <button onClick={() => setShowSignIn(false)} className="w-full text-gray-600 hover:text-gray-800 transition-colors duration-300">Close</button>
          </div>
        </div>
      )}

      {showSignUp && (
        <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-40">
          <div className="bg-white p-6 rounded-lg shadow w-80">
            <h2 className="text-xl font-bold mb-4">Sign Up</h2>
            <input type="text" placeholder="Full Name" value={name} onChange={(e) => setName(e.target.value)} className="w-full mb-2 p-2 border rounded"/>
            <input type="email" placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} className="w-full mb-2 p-2 border rounded"/>
            <input type="password" placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)} className="w-full mb-4 p-2 border rounded"/>
            {error && <p className="text-red-500 mb-2">{error}</p>}
            <button onClick={handleSignUpClick} className="w-full bg-green-600 text-white py-2 rounded mb-2 hover:bg-green-700 transition-colors duration-300">Create Account</button>
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

          <Route path="/demo-quiz" element={
            <ProtectedRoute>
              <DemoQuiz />
            </ProtectedRoute>
          } />

          <Route path="/quiz-one" element={
            <ProtectedRoute premiumOnly={true}>
              <QuizOne />
            </ProtectedRoute>
          } />
          <Route path="/quiz-two" element={
            <ProtectedRoute premiumOnly={true}>
              <QuizTwo />
            </ProtectedRoute>
          } />

          <Route path="/subscribe" element={
            <ProtectedRoute>
              <Subscribe />
            </ProtectedRoute>
          } />

          <Route path="/reset-password" element={<ResetPassword />} />

          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </main>

      <Toaster position="top-right" />
    </div>
  );
};

const App = () => (
  <AuthProvider>
    <Router>
      <AppContent />
    </Router>
  </AuthProvider>
);

export default App;
