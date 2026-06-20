import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';

const firebaseConfig = {

  apiKey: "AIzaSyBjWzG2x20I9OFlQks04yW0bQmnrwqKXHs",

  authDomain: "apploginfirebase-e176d.firebaseapp.com",

  projectId: "apploginfirebase-e176d",

  storageBucket: "apploginfirebase-e176d.firebasestorage.app",

  messagingSenderId: "436640431080",

  appId: "1:436640431080:web:efd65f1cfafe80dd22025d",

  measurementId: "G-W6MHT4T45N"

};


const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);
export const db = getFirestore(app);