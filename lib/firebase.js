// Import the functions you need from the SDKs you need
const { initializeApp } = require('firebase/app');
const { getAuth } = require('firebase/auth');
const { getFirestore } = require('firebase/firestore');

// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyA-USubrJHqkXxRot_lOcXAVgA_NuubfkI",
  authDomain: "capstone-a---full-stack.firebaseapp.com",
  projectId: "capstone-a---full-stack",
  storageBucket: "capstone-a---full-stack.firebasestorage.app",
  messagingSenderId: "424030949690",
  appId: "1:424030949690:web:5763e68ad07b8c08c04003"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

export default app;
export const auth = getAuth(app);
export const db = getFirestore(app);


