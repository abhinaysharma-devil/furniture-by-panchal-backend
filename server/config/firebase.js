
import dotenv from 'dotenv';


import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";

dotenv.config();

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: process.env.VITE_API_KEY,
  authDomain: process.env.VITE_AUTH_DOMAIN,
  projectId: process.env.VITE_PROJECT_ID,
  storageBucket: process.env.VITE_STORAGE_BUCKET,
  messagingSenderId: process.env.VITE_MESSAGING_SENDER_ID,
  appId: process.env.VITE_APP_ID
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

const db = getFirestore(app, 'furniturebypanchal');

const extractQueryData = (querySnapshot) => {
  return querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
}

const extractDocData = (docSnap) => {
  if (docSnap.exists()) {
    return { id: docSnap.id, ...docSnap.data() };
  }
  return null;
}


export { db, extractQueryData, extractDocData };