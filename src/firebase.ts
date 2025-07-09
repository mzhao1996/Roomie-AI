// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getAuth } from "firebase/auth";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyCzBBQ6hTtvQcUeECQC0O8fklreq1dG3z0",
  authDomain: "roomie-ai-28aa7.firebaseapp.com",
  projectId: "roomie-ai-28aa7",
  storageBucket: "roomie-ai-28aa7.firebasestorage.app",
  messagingSenderId: "50153609839",
  appId: "1:50153609839:web:4c98e281cc495b96004b9a",
  measurementId: "G-J007E68M3J"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
const analytics = getAnalytics(app);