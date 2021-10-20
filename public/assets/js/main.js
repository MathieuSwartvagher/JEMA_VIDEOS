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
    fetch(`https://www.googleapis.com/youtube/v3/search?key=AIzaSyAebvd-2-p33hyYnFlWGG_CCB0ewB80AQ8&q=${selectBox.value}&part=snippet,id&maxResults=6`)
    .then((resp) => {
        return resp.json()
    })
    .then((data) => {
        grid(data.items);
    })
    .catch(() => {
        // catch any errors
    });
});

function grid(videosListe) {
    let grid = document.querySelector("#gridVideos");

    grid.innerHTML = "";

    videosListe.forEach(video => {
        let vid = document.createElement("video");
        vid.classList.add("video");
        let a = document.createAttribute("data-yt2html5");
        a.value = 'https://www.youtube.com/watch?v='+video.id.videoId
        vid.setAttributeNode(a);
        vid.controls = true;        
        grid.appendChild(vid);
        window.player.load();
    });
}

document.querySelector('#btnPip').addEventListener("click", () => {
    togglePictureInPicture()
});

async function togglePictureInPicture() {
    if (document.pictureInPictureElement) {
        document.exitPictureInPicture();
    } else {
      if (document.pictureInPictureEnabled) {
        let video = document.querySelector("video");
        await video.requestPictureInPicture();
      }
    }
  }