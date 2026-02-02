import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore"; // 1. Importe Firestore
import { getAuth } from "firebase/auth";           // 2. Importe Auth (pour plus tard)
import { getStorage } from "firebase/storage"

const firebaseConfig = {
  apiKey: "AIzaSyCZIdgPWIJH-ptdiVxWLb9clTenIcytIeQ",
  authDomain: "store-muscu.firebaseapp.com",
  projectId: "store-muscu",
  storageBucket: "store-muscu.firebasestorage.app",
  messagingSenderId: "567354508823",
  appId: "1:567354508823:web:29f97e7cb0d752bca73e52",
  measurementId: "G-F4T7B5YCFV"
};

// Initialisation de Firebase
const app = initializeApp(firebaseConfig);

// 3. Initialise les services dont on a besoin
const db = getFirestore(app); 
const auth = getAuth(app);

const storage = getStorage(app);

// 4. EXPORTE les variables pour les utiliser ailleurs
export { db, auth, storage };