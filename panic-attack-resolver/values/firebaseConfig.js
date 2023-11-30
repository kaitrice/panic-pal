import { initializeApp } from "firebase/app";
import ReactNativeAsyncStorage from '@react-native-async-storage/async-storage';
import {getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword, deleteUser, initializeAuth, getReactNativePersistence} from "firebase/auth";



const firebaseConfig = {
    apiKey: "AIzaSyA3R6PRMRFQUxzypF3r2aF6u3bUQZbSYo4",
    authDomain: "panic-pal-2c570.firebaseapp.com",
    databaseURL: "https://panic-pal-2c570-default-rtdb.firebaseio.com",
    projectId: "panic-pal-2c570",
    storageBucket: "panic-pal-2c570.appspot.com",
    messagingSenderId: "155711624441",
    appId: "1:155711624441:web:b1e2a4f409f0cfa4ba3e28",
    measurementId: "G-8WFS40Z2VR"
  };

const app = initializeApp(firebaseConfig)
initializeAuth(app, {
    persistence: getReactNativePersistence(ReactNativeAsyncStorage)
});

export {app, getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword, deleteUser}
export const { getDatabase, ref, child, get, set, push } = require('@firebase/database');