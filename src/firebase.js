// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyCyZFRlA53KaHhR1Sfgy86LHNAuGBM1yxQ",
  authDomain: "weather-app-c0b03.firebaseapp.com",
  projectId: "weather-app-c0b03",
  storageBucket: "weather-app-c0b03.appspot.com",
  messagingSenderId: "475388704390",
  appId: "1:475388704390:web:c61eefca9a1b9edabbc307"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export default app;