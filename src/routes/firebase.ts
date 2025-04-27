import { initializeApp } from "firebase/app";
import { getAuth, signInWithPopup, GoogleAuthProvider, onAuthStateChanged, createUserWithEmailAndPassword, signInWithEmailAndPassword, signOut } from "firebase/auth";

const firebaseConfig = {
    apiKey: "AIzaSyDh5RdviO7Yizny6md2LDcGq2pVxs-ou00",
    authDomain: "whos-that-cosmere-character.firebaseapp.com",
    projectId: "whos-that-cosmere-character",
    storageBucket: "whos-that-cosmere-character.firebasestorage.app",
    messagingSenderId: "1064982731767",
    appId: "1:1064982731767:web:14795b74c21ed6532aacf2"
  };

const app = initializeApp(firebaseConfig);

const auth = getAuth(app);
const provider = new GoogleAuthProvider();

export { app, auth, provider, onAuthStateChanged, signInWithPopup, createUserWithEmailAndPassword, signInWithEmailAndPassword, signOut };
