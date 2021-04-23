import firebase from "firebase";

const firebaseConfig = {
  apiKey: "AIzaSyA6h7xvphtywMtXmyyLO4YXzbssVxtluks",
  authDomain: "disney-plus-clone-82c55.firebaseapp.com",
  projectId: "disney-plus-clone-82c55",
  storageBucket: "disney-plus-clone-82c55.appspot.com",
  messagingSenderId: "11915604737",
  appId: "1:11915604737:web:68ecd6e20b69dafddae100",
  measurementId: "G-9S0NYG953T"
};

const firebaseApp = firebase.initializeApp(firebaseConfig);
const db = firebaseApp.firestore();
const auth = firebase.auth();
const provider = new firebase.auth.GoogleAuthProvider();
const storage = firebase.storage();

export { auth, provider, storage };
export default db;
