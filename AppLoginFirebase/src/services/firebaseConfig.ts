import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';

const firebaseConfig = {
  apiKey: "COLE_A_API_KEY_AQUI",
  authDomain: "COLE_O_AUTH_DOMAIN_AQUI",
  projectId: "COLE_O_PROJECT_ID_AQUI",
  storageBucket: "COLE_O_STORAGE_BUCKET_AQUI",
  messagingSenderId: "COLE_O_MESSAGING_SENDER_ID_AQUI",
  appId: "COLE_O_APP_ID_AQUI"
};

const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);
export const db = getFirestore(app);