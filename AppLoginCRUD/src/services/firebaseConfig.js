import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';

// Substitua os valores abaixo pelas chaves reais do seu projeto no Firebase
const firebaseConfig = {
  apiKey: "COLOQUE_SUA_API_KEY_AQUI",
  authDomain: "COLOQUE_SEU_AUTH_DOMAIN_AQUI",
  projectId: "COLOQUE_SEU_PROJECT_ID_AQUI",
  storageBucket: "COLOQUE_SEU_STORAGE_BUCKET_AQUI",
  messagingSenderId: "COLOQUE_SEU_MESSAGING_SENDER_ID_AQUI",
  appId: "COLOQUE_SEU_APP_ID_AQUI"
};

// Inicializa o aplicativo Firebase
const app = initializeApp(firebaseConfig);

// Exporta os serviços para serem usados em outras telas (como o CrudExemploScreen)
export const db = getFirestore(app);
export const auth = getAuth(app);