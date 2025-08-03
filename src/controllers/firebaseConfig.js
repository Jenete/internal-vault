// firebase/firebaseConfig.js
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";

const firebaseConfig = {
  apiKey: "AIzaSyD80n7BE7EPqIWtVimNxAT-JS79xhp4DPM",
  authDomain: "ridelogic-47e4c.firebaseapp.com",
  projectId: "ridelogic-47e4c",
  storageBucket: "ridelogic-47e4c.firebasestorage.app",
  messagingSenderId: "535093754819",
  appId: "1:535093754819:web:09738a785923bf232d5b76"
};

const app =  initializeApp(firebaseConfig);
export const auth =  getAuth(app);
export const db =  getFirestore(app);
export const storage = getStorage(app);

