import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';
import { getAuth } from 'firebase/auth';

const firebaseConfig = {
  apiKey: "AIzaSyAxVGlNg2dccp_9EOtuDXvkyqaTZ0k7z2U",
  authDomain: "flight-booking-system-296a1.firebaseapp.com",
  projectId: "flight-booking-system-296a1",
  storageBucket: "flight-booking-system-296a1.firebasestorage.app",
  messagingSenderId: "1030728335765",
  appId: "1:1030728335765:web:513250bf4dcd696144769c"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Firestore
export const db = getFirestore(app);

// Initialize Auth
export const auth = getAuth(app);

export default app;