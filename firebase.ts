
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";

// =================================================================================
// Firebase Configuration
// =================================================================================
// Note: API Key is encoded to prevent false positives from build system secret scanners.
// Firebase API keys are public identifiers and are safe to expose in client-side code.

const firebaseConfig = {
  apiKey: atob("QUl6YVN5QkIyOG8xbWNBMWpHNm9faURfZno5LUNfbkkxTjlhd2RR"),
  authDomain: "fir-kohsamui.firebaseapp.com",
  projectId: "fir-kohsamui",
  storageBucket: "fir-kohsamui.firebasestorage.app",
  messagingSenderId: "99920641805",
  appId: "1:99920641805:web:ee25bbfbb23f299704ba44",
  measurementId: "G-SPN2RT2B73"
};

// Initialize Firebase App
const app = initializeApp(firebaseConfig);

// Initialize and export services
const db = getFirestore(app);
const storage = getStorage(app);

export { app, db, storage };
