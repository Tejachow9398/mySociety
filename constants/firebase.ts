// File: constants/firebase.ts

// Import the compat libraries for broader compatibility
import firebase from 'firebase/compat/app';
import 'firebase/compat/auth'; 

export const firebaseConfig = {
  apiKey: "AIzaSyC6EhVpJxf6Tiq6nwHAe3t9EvmWDCpXSTk",
  authDomain: "my-society-app-c1c97.firebaseapp.com",
  projectId: "my-society-app-c1c97",
  storageBucket: "my-society-app-c1c97.firebasestorage.app",
  messagingSenderId: "131007193695",
  appId: "1:131007193695:web:9da9ca52dbe4e9b3e7f1ea",
  measurementId: "G-CJXCNNBX81"
};

// Initialize Firebase if it hasn't been already
if (!firebase.apps.length) {
  firebase.initializeApp(firebaseConfig);
}

// Export the entire initialized firebase object as the default export
export default firebase;
