import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';
import { getAuth } from 'firebase/auth';

const firebaseConfig = {
  apiKey: "AIzaSyCBesuRldb8Hs6Bo7tu_XxsuSTRE_VDK0o",
  authDomain: "prismiq-4f133.firebaseapp.com",
  projectId: "prismiq-4f133",
  storageBucket: "prismiq-4f133.firebasestorage.app",
  messagingSenderId: "13186046723",
  appId: "1:13186046723:web:b25359c3320c0c027a2736",
  measurementId: "G-CN6GBP5E6M"
};

const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
export const auth = getAuth(app);
