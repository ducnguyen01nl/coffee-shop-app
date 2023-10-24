import { initializeApp } from "firebase/app";
// import { getAnalytics } from "firebase/analytics";
import { getAuth} from "firebase/auth";
import { getFirestore} from "firebase/firestore";
import {getStorage} from 'firebase/storage'
import { initializeAuth, getReactNativePersistence } from 'firebase/auth';
import ReactNativeAsyncStorage from '@react-native-async-storage/async-storage'; // Import AsyncStorage
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyDPLU_IpY6y7mqkre4bNDQac8iDKkqrEug",
  authDomain: "coffee-shop-54b40.firebaseapp.com",
  projectId: "coffee-shop-54b40",
  storageBucket: "coffee-shop-54b40.appspot.com",
  messagingSenderId: "714900241686",
  appId: "1:714900241686:web:ce7b48b0bd41f16dc46437",
  measurementId: "G-XW31FRNG3Y"
};

// Initialize Firebase 
const app = initializeApp(firebaseConfig);
// const analytics = getAnalytics(app);

// const auth = getAuth(app);
const auth = initializeAuth(app, {
  persistence: getReactNativePersistence(ReactNativeAsyncStorage),
});
// const auth = initializeAuth(app, {
//   persistence: getReactNativePersistence(ReactNativeAsyncStorage)
// });
const db = getFirestore(app);
const storage = getStorage(app);

export {app,auth,db,storage}