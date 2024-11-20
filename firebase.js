// firebase.js

// Import the functions you need from the SDKs you need
import { initializeApp } from 'firebase/app';
import {
  initializeAuth,
  getReactNativePersistence,
} from 'firebase/auth';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { getStorage } from 'firebase/storage';

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyAZoOd_kBO6-Y7RtKZVdPSdU7OpT3Et1rw",             // Replace with your API key
  authDomain: "dank-dddaa.firebaseapp.com",
  projectId: "dank-dddaa",
  storageBucket: "dank-dddaa.appspot.com", // Corrected storageBucket value
  messagingSenderId: "819656495816",
  appId: "1:819656495816:web:58a5454d9f0e9a904a4bfd",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Firebase Auth with persistence
const auth = initializeAuth(app, {
  persistence: getReactNativePersistence(AsyncStorage),
});

// Initialize Firebase Storage
const storage = getStorage(app);

export { auth, storage };
