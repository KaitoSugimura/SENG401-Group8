import firebase from "firebase";
import "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyBDwkUmzxK9kDSEgNLCnDxl-PJgFXQ6D-o",
  authDomain: "seng401-temp.firebaseapp.com",
  projectId: "seng401-temp",
  storageBucket: "seng401-temp.appspot.com",
  messagingSenderId: "597090153976",
  appId: "1:597090153976:web:151f7cb0bbbfe774d3520d",
};

firebase.initializeApp(firebaseConfig);

const projectFirestore = firebase.firestore();
const projectAuth = firebase.auth();

export { projectFirestore, projectAuth };
