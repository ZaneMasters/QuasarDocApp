// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";
import { getAuth } from "firebase/auth";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyC4Yo96x5-B9YkmUft2tC_Rj-ggm_R92fc",
  authDomain: "quasarfirebase-bf573.firebaseapp.com",
  projectId: "quasarfirebase-bf573",
  storageBucket: "quasarfirebase-bf573.appspot.com",
  messagingSenderId: "407266641212",
  appId: "1:407266641212:web:aa1dc14d93d4561deb4a39"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const storage = getStorage(app);
const auth = getAuth(app);

export { db, storage, auth };