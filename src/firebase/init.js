import firebase from "firebase";
import firestore from "firebase/firestore";

// Initialize Firebase
var config = {
  apiKey: "AIzaSyDpLvp5ReyInQpj8-Ohvl-fi0YzkN8GgbU",
  authDomain: "simple-signup-1a889.firebaseapp.com",
  databaseURL: "https://simple-signup-1a889.firebaseio.com",
  projectId: "simple-signup-1a889",
  storageBucket: "simple-signup-1a889.appspot.com",
  messagingSenderId: "442411008302"
};
const firebaseApp = firebase.initializeApp(config);

export default firebaseApp.firestore();
