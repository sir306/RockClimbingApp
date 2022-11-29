// Import the functions you need from the SDKs you need
import firebase from 'firebase/compat/app';
import 'firebase/compat/auth';
import 'firebase/compat/firestore';
import 'firebase/compat/storage';
import {
  API_KEY,
  AUTH_DOMAIN,
  PROJECT_ID,
  MESSAGING_SENDER_ID,
  APP_ID,
  STORAGE_BUCKET,
} from '@env';

// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: API_KEY,
  authDomain: AUTH_DOMAIN,
  projectId: PROJECT_ID,
  messagingSenderId: MESSAGING_SENDER_ID,
  appId: APP_ID,
  storageBucket: STORAGE_BUCKET,
};

// Initialize Firebase
let app;

if (firebase.apps.length === 0) {
  app = firebase.initializeApp(firebaseConfig);
  console.log('Connected to firebase');
} else {
  app = firebase.app();
  console.log('Connected to firebase');
}

const db = app.firestore();
const auth = firebase.auth();

// custom user check for admin function
async function userAdmin(uid) {
  const userCol = db.collection('users');
  const snapshot = await userCol.where('id', '==', uid).get();
  let admin;
  if (!snapshot.empty) {
    snapshot.forEach((doc) => {
      if (doc.data().admin) {
        admin = true;
      } else {
        admin = false;
      }
    });
  }
  return admin;
}

// custom method to create new user in users db for purpose of admin
async function newUser(id) {
  const userCol = db.collection('users');
  const snapshot = userCol.add({ id: id, admin: false });
  console.log('new user added');
}

export { db, auth, firebase, userAdmin, newUser };
