import { initializeApp, getApps, getApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getAnalytics, isSupported } from "firebase/analytics";

const firebaseConfig = {
  apiKey: "AIzaSyB6CxDYFQk5iZrrZKIpjVi4orhQQJIHDLA",
  authDomain: "opcaoconsulting.firebaseapp.com",
  projectId: "opcaoconsulting",
  storageBucket: "opcaoconsulting.firebasestorage.app",
  messagingSenderId: "10944402594",
  appId: "1:10944402594:web:009588d424120a542bf3fb",
  measurementId: "G-910YJ584Q3"
};

// Initialize Firebase
const app = !getApps().length ? initializeApp(firebaseConfig) : getApp();

// Initialize and export services
export const auth = getAuth(app);
export const db = getFirestore(app);

// Analytics helper
export const initAnalytics = async () => {
  if (typeof window !== "undefined" && await isSupported()) {
    return getAnalytics(app);
  }
  return null;
};

export default app;