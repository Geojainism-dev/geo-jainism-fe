// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyDiLCHU6DCd_tOiK8m_2A_G5e9xzoJG_KE",
  authDomain: "tamil-jain.firebaseapp.com",
  projectId: "tamil-jain",
  storageBucket: "tamil-jain.firebasestorage.app",
  messagingSenderId: "1068359000969",
  appId: "1:1068359000969:web:a3326139149865b0d6f758",
  measurementId: "G-Z50HJXKBF2"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);

export { app, analytics };
