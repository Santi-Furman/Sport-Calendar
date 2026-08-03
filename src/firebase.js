import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

// Reemplaza con los datos reales de tu consola de Firebase
// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyBgk7Ya7hVSVizEXJLroQ1TdiNYyCawVIk",
  authDomain: "sport-calendar-ba5db.firebaseapp.com",
  projectId: "sport-calendar-ba5db",
  storageBucket: "sport-calendar-ba5db.firebasestorage.app",
  messagingSenderId: "892748363101",
  appId: "1:892748363101:web:591ff92bec11b3e53ee4b4",
  measurementId: "G-0DDZSX9WM3"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);

export const auth = getAuth(app);
export const googleProvider = new GoogleAuthProvider();
export const db = getFirestore(app);