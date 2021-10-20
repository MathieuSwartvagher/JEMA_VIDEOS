// Your web app's Firebase configuration
const firebaseConfig = {
    apiKey: "AIzaSyBHB1wqBs1Kc0_jGoV8aRQCrV5427tqb_4",
    authDomain: "jema-video.firebaseapp.com",
    databaseURL: "https://jema-video-default-rtdb.europe-west1.firebasedatabase.app",
    projectId: "jema-video",
    storageBucket: "jema-video.appspot.com",
    messagingSenderId: "493492166576",
    appId: "1:493492166576:web:7b39d3a618b4d0e54ac075"
};

// Initialize Firebase
const app = firebase.initializeApp(firebaseConfig);
const db = firebase.firestore();



window.addEventListener("load", () => {
    getUsers();
})

function getUsers() {
    db.collection("users").get().then((querySnapshot) => {
        querySnapshot.forEach((doc) => {
            console.dir(doc.data());
        });
    });
}