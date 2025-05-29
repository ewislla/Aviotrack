
// firebase.ts
import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';

const firebaseConfig = {
  apiKey: "AIzaSyAaX-qqzhd7StI1dTbcDIrFNqzjv7Ms5QE",
  authDomain: "flight-system-1e4ff.firebaseapp.com",
  projectId: "flight-system-1e4ff",
  storageBucket: "flight-system-1e4ff.firebasestorage.app",
  messagingSenderId: "362753887118",
  appId: "1:362753887118:web:224738d5e7772c36c132df"
};

const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
