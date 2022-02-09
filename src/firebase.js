import firebase from 'firebase';

const firebaseConfig = {
    apiKey: "AIzaSyBDbieQ9kNY4Lo9qVE53jBuWAW_OEK1x-I",
    authDomain: "conquer-goals.firebaseapp.com",
    databaseURL: "https://conquer-goals.firebaseio.com",
    projectId: "conquer-goals",
    storageBucket: "conquer-goals.appspot.com",
    messagingSenderId: "211268365227",
    appId: "1:211268365227:web:0145be98c216a7b76040ee",
    measurementId: "G-S2T952SEKN"
};

const firebaseApp = firebase.initializeApp(firebaseConfig);

export default firebaseApp;