// Import the functions you need from the SDKs you need
import firebase from "firebase/compat/app";
import "firebase/compat/auth";
import "firebase/compat/firestore";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyDcm1XV1KhMDFg_sfn3lZztnAzi1LDPzXU",
  authDomain: "rockclimbingproject-bf50a.firebaseapp.com",
  projectId: "rockclimbingproject-bf50a",
  storageBucket: "rockclimbingproject-bf50a.appspot.com",
  messagingSenderId: "778422287266",
  appId: "1:778422287266:web:bfffb229ae2ba1bac610fb",
};

// Initialize Firebase
let app;

if (firebase.apps.length === 0) {
  app = firebase.initializeApp(firebaseConfig);
  console.log("Connected to firebase");
} else {
  app = firebase.app();
  console.log("Connected to firebase");
}

const db = app.firestore();
const auth = firebase.auth();

export { db, auth };
