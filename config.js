import firebase from 'firebase';
require('@firebase/firestore');

var firebaseConfig = {
    apiKey: "AIzaSyBASmpVkaVSH_wiDDfpjiM9gJmG_aUxIAM",
    authDomain: "my-app-c-91.firebaseapp.com",
    projectId: "my-app-c-91",
    storageBucket: "my-app-c-91.appspot.com",
    messagingSenderId: "470844050833",
    appId: "1:470844050833:web:ff94ae0bc77a1f86e45e30"
  };
firebase.initializeApp(firebaseConfig);
export default firebase.firestore();