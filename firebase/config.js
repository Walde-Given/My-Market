
// firebase/config.js
import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import { getStorage } from 'firebase/storage';
import { getDatabase } from 'firebase/database';

const firebaseConfig = {
  apiKey: "AIzaSyA8LZ_BSHozCJNLzgC1ROndDeDZjmSN-Q0",
  authDomain: "mymarket-a2779.firebaseapp.com",
  databaseURL: "https://mymarket-a2779-default-rtdb.firebaseio.com",
  projectId: "mymarket-a2779",
  storageBucket: "mymarket-a2779.firebasestorage.app",
  messagingSenderId: "359328957679",
  appId: "1:359328957679:web:bee0b6c5ebfdacb9b8071a",
  measurementId: "G-BDXX5ZLKY0"  // Optional, no effect in React Native
};

// Initialize Firebase app
const app = initializeApp(firebaseConfig);

// Initialize Firebase services
const auth = getAuth(app);
const db = getFirestore(app);
const storage = getStorage(app);
const realtimeDb = getDatabase(app);

export { app, auth, db, storage, realtimeDb };
