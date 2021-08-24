import firebase from "firebase/app";
import "firebase/auth";
import "firebase/firestore";
import "firebase/storage";

const firebaseConfig = {
  apiKey: "AIzaSyCtsAxUGM0q65H-23EbHMR9lrjA7MqwX64",
  authDomain: "lantaw-chatbot.firebaseapp.com",
  projectId: "lantaw-chatbot",
  storageBucket: "lantaw-chatbot.appspot.com",
  messagingSenderId: "776383263813",
  appId: "1:776383263813:web:9f833bdb09d8ebeb989f2c",
};
// Initialize Firebase
if (!firebase.apps.length) {
  firebase.initializeApp(firebaseConfig);
}
export const auth = firebase.auth();
export const firestore = firebase.firestore();
export const storage = firebase.storage();
