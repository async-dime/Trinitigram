import Firebase from "firebase/app"; //firebase SDK
import "firebase/firestore"; //firestore for database
import "firebase/auth"; //auth for user authentication

// import {seedDatabase} from '../seed'

const config = {
    apiKey: "AIzaSyCVABx6UvItDvYlwWAkncVi5I5chpJDTCY",
    authDomain: "trinitigram.firebaseapp.com",
    projectId: "trinitigram",
    storageBucket: "trinitigram.appspot.com",
    messagingSenderId: "351124909017",
    appId: "1:351124909017:web:ce050970584cc4d236c7c8",
};

const firebase = Firebase.initializeApp(config);

// seedDatabase(firebase)

const { FieldValue } = Firebase.firestore;

export { firebase, FieldValue };
