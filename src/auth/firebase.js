import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyAoFkYKlVUxqMK6naNgFe9ogU7Kk0fYeGo",
  authDomain: "clone-ea1a7.firebaseapp.com",
  projectId: "clone-ea1a7",
  storageBucket: "clone-ea1a7.firebasestorage.app",
  messagingSenderId: "133804534814",
  appId: "1:133804534814:web:2b4b3ea0ef3ecab63c920f",
  measurementId: "G-JRCZRGZ9WB"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);
export {auth, db};