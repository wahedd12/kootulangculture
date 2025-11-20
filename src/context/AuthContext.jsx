// src/context/AuthContext.jsx
import { createContext, useContext, useEffect, useState } from "react";
import { onAuthStateChanged, signInWithEmailAndPassword, createUserWithEmailAndPassword, signOut as firebaseSignOut, updateProfile } from "firebase/auth";
import { auth } from "../firebase/config";

const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

const AuthProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setCurrentUser(user);
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  // Sign up with email, password, and display name
  const signUp = async (name, email, password) => {
    const { user } = await createUserWithEmailAndPassword(auth, email, password);
    if (name) await updateProfile(user, { displayName: name });
    setCurrentUser({ ...user, displayName: name });
  };

  // Sign in with email and password
  const signIn = async (email, password) => {
    await signInWithEmailAndPassword(auth, email, password);
  };

  // Sign out
  const signOut = async () => {
    await firebaseSignOut(auth);
    setCurrentUser(null);
  };

  const value = {
    currentUser,
    signUp,
    signIn,
    signOut,
  };

  return <AuthContext.Provider value={value}>{!loading && children}</AuthContext.Provider>;
};

export default AuthProvider;
