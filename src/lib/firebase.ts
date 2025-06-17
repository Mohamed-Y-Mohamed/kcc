// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyDZfCs66WgiB3srJIGWSyGXe1mhqo5yHG0",
  authDomain: "kcccofeeresutarantand-hotel.firebaseapp.com",
  projectId: "kcccofeeresutarantand-hotel",
  storageBucket: "kcccofeeresutarantand-hotel.firebasestorage.app",
  messagingSenderId: "60529921591",
  appId: "1:60529921591:web:782b00b7e15e9d284479b2",
  measurementId: "G-HWHMZT51E8",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);

export { app };
