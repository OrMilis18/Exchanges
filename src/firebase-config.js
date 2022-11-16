import { initializeApp } from "firebase/app";
import {getFirestore} from "firebase/firestore";
import {getStorage} from "firebase/storage";
import {getAuth, GoogleAuthProvider} from 'firebase/auth';
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyBYAH2u_WGbtELijCL5IUjxD71g2Ay9JQU",
  authDomain: "exchanges-app-60eca.firebaseapp.com",
  projectId: "exchanges-app-60eca",
  storageBucket: "exchanges-app-60eca.appspot.com",
  messagingSenderId: "469709540518",
  appId: "1:469709540518:web:188fbe4943ea49e0cb3867"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const storage = getStorage(app);
export const db = getFirestore(app);
export const auth = getAuth(app);
export const provider = new GoogleAuthProvider();