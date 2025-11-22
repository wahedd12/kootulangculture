// src/context/AuthContext.jsx
import React, { createContext, useContext, useEffect, useState } from "react";
import { auth, db } from "../firebase/config";
import { 
  onAuthStateChanged, 
  createUserWithEmailAndPassword, 
  signInWithEmailAndPassword, 
  signOut as firebaseSignOut, 
  updateProfile 
} from "firebase/auth";
import { doc, setDoc, onSnapshot } from "firebase/firestore";

const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // Listen for auth state changes
  useEffect(() => {
    const unsubscribeAuth = onAuthStateChanged(auth, (user) => {
      if (user) {
        const userRef = doc(db, "users", user.uid);
        // Listen for Firestore updates on the user document
        const unsubscribeDoc = onSnapshot(userRef, (docSnap) => {
          setCurrentUser({ ...user, ...docSnap.data() });
        });
        setLoading(false);
        return unsubscribeDoc;
      } else {
        setCurrentUser(null);
        setLoading(false);
      }
    });

    return () => unsubscribeAuth();
  }, []);

  // Sign up function
  const signUp = async (displayName, email, password) => {
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    await updateProfile(userCredential.user, { displayName });
    // Create Firestore document
    await setDoc(doc(db, "users", userCredential.user.uid), {
      email,
      displayName,
      isPremium: false,
      premiumExpiry: null,
    });
  };

  // Sign in function
  const signIn = (email, password) => signInWithEmailAndPassword(auth, email, password);

  // Sign out function
  const signOut = () => firebaseSignOut(auth);

  return (
    <AuthContext.Provider value={{ currentUser, loading, signUp, signIn, signOut }}>
      {!loading && children}
    </AuthContext.Provider>
  );
};
