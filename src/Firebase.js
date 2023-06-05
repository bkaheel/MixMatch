// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyAiUY_eWfnV03DB2e14nH11EfaFDF1MPcc",
  authDomain: "mixmatch-9c566.firebaseapp.com",
  projectId: "mixmatch-9c566",
  storageBucket: "mixmatch-9c566.appspot.com",
  messagingSenderId: "908531747483",
  appId: "1:908531747483:web:632915c46727ecc3bc543e",
  measurementId: "G-SDWQJEVNZK"
};

// Initialize Firebase
export const app = initializeApp(firebaseConfig);
export const auth = getAuth();
export const db = getFirestore();

