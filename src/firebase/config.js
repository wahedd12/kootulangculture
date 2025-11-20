// Import Firebase modules
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

// Your Firebase Web App config (replace with yours exactly)
const firebaseConfig = {
  apiKey: "AIzaSyAGP2khxWMshJMYr9CQN703wWf1keUSCtU",
  authDomain: "kootulangculture.firebaseapp.com", // must end with .firebaseapp.com
  projectId: "kootulangculture",
  storageBucket: "kootulangculture.appspot.com",
  messagingSenderId: "504994772598",
  appId: "1:504994772598:web:4f12c803f6fd0870fd9157"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Auth & Firestore instances
export const auth = getAuth(app);
export const db = getFirestore(app);
