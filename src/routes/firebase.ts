import { initializeApp, deleteApp  } from "firebase/app";

const firebaseConfig = {
    apiKey: "AIzaSyDh5RdviO7Yizny6md2LDcGq2pVxs-ou00",
    authDomain: "whos-that-cosmere-character.firebaseapp.com",
    projectId: "whos-that-cosmere-character",
    storageBucket: "whos-that-cosmere-character.firebasestorage.app",
    messagingSenderId: "1064982731767",
    appId: "1:1064982731767:web:14795b74c21ed6532aacf2"
  };

const app = initializeApp(firebaseConfig);

export { app, deleteApp };
