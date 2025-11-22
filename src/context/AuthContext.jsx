// src/context/AuthContext.jsx
import { createContext, useContext, useEffect, useState } from "react";
import {
  onAuthStateChanged,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut as firebaseSignOut,
  updateProfile,
} from "firebase/auth";
import { auth, db } from "../firebase/config";
import { doc, getDoc } from "firebase/firestore";

const AuthContext = createContext();
export const useAuth = () => useContext(AuthContext);

const AuthProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user) {
        try {
          // Fetch extra user info from Firestore
          const userRef = doc(db, "users", user.uid);
          const snap = await getDoc(userRef);
          const data = snap.exists() ? snap.data() : {};
          setCurrentUser({ ...user, displayName: user.displayName, isPremium: data.isPremium || false });
        } catch (err) {
          console.error("Failed to fetch user data:", err);
          setCurrentUser({ ...user, displayName: user.displayName, isPremium: false });
        }
      } else {
        setCurrentUser(null);
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  // Sign up with email, password, and display name
  const signUp = async (name, email, password) => {
    const { user } = await createUserWithEmailAndPassword(auth, email, password);
    if (name) await updateProfile(user, { displayName: name });
    setCurrentUser({ ...user, displayName: name, isPremium: false });
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

  const value = { currentUser, setCurrentUser, signUp, signIn, signOut };

  return <AuthContext.Provider value={value}>{!loading && children}</AuthContext.Provider>;
};

export default AuthProvider;
