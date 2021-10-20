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

let selectBox = document.querySelector('#channelSelect');

window.addEventListener("load", () => {
    getUsers();
    getVideos();
})

function getUsers() {
    db.collection("users").get().then((querySnapshot) => {
        querySnapshot.forEach((doc) => {
            //console.dir(doc.data());
        });
    });
}

function getVideos() {
    const docRef = db.collection("channel").doc("Liste_chaine");

    docRef.get().then((doc) => {
        if (doc.exists) {
            const data = doc.data();

            affectVideos(data.tableau);
        } else {
            // doc.data() will be undefined in this case
            console.log("No such document!");
        }
    }).catch((error) => {
        console.log("Error getting document:", error);
    });
}

function affectVideos(listeChaines){
    listeChaines.forEach(channel => {
        selectBox.options.add(
          new Option(channel, channel, false)
        );
    });
}

selectBox.addEventListener('change', () => {
    fetch(`https://www.googleapis.com/youtube/v3/search?key=AIzaSyAebvd-2-p33hyYnFlWGG_CCB0ewB80AQ8&q=${selectBox.value}&part=snippet,id&maxResults=5`)
    .then((resp) => {
        return resp.json()
    })
    .then((data) => {
        const videosListe = data
        showVideos(videosListe.items);
    })
    .catch(() => {
        // catch any errors
    });
});

function showVideos(videosListe){
    videosListe.forEach(video => {
        console.dir(video.id.videoId)
    });
}

function grid() {
    var container = document.createElement('div');
    container.id = "main";
    container.className = "container";

    for (var i = 0; i < 16; i++) {

        var row = document.createElement('div');
        row.className = "row";
        row.id = "row" + i;

        for (var j = 0; j < 16; j++) {
            var box = document.createElement('div');
            box.className = 'box';
            row.appendChild(box);
        }

        container.appendChild(row);
    }

    return container;
}