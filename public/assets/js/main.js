//Firebase configuration
const firebaseConfig = {
    apiKey: "AIzaSyBHB1wqBs1Kc0_jGoV8aRQCrV5427tqb_4",
    authDomain: "jema-video.firebaseapp.com",
    databaseURL: "https://jema-video-default-rtdb.europe-west1.firebasedatabase.app",
    projectId: "jema-video",
    storageBucket: "jema-video.appspot.com",
    messagingSenderId: "493492166576",
    appId: "1:493492166576:web:7b39d3a618b4d0e54ac075"
};

//Initialisation Firebase
const app = firebase.initializeApp(firebaseConfig);

//Initialisation FireStore
const db = firebase.firestore();

let selectBox = document.querySelector('#channelSelect');
let pageVideo = document.querySelector("#pageVideo");
let pageConnexion = document.querySelector("#connexion");


window.addEventListener("load", () => {
    //Génération de l'authentification
    let ui = new firebaseui.auth.AuthUI(firebase.auth());
    let uiConfig = {
        callbacks: {
            signInSuccessWithAuthResult: function (authResult, redirectUrl) {
                pageVideo.classList.remove("hide");
                pageConnexion.classList.add("hide");
                return true;
            },
            uiShown: function () {
                document.querySelector('#loader').classList.add('hide');
            }
        },
        signInFlow: 'popup',
        signInOptions: [
            firebase.auth.GoogleAuthProvider.PROVIDER_ID,
            firebase.auth.EmailAuthProvider.PROVIDER_ID,
            firebase.auth.PhoneAuthProvider.PROVIDER_ID
        ]
    };
    ui.start('#firebaseui-auth-container', uiConfig);
    pageVideo.classList.add("hide");
    getChannel();
})

//Récupération des chaînes sur firestore
function getChannel() {
    const docRef = db.collection("channel").doc("Liste_chaine");

    docRef.get().then((doc) => {
        if (doc.exists) {
            const data = doc.data();

            affectChannelToList(data.tableau);
        } else {
            // doc.data() will be undefined in this case
            console.log("No such document!");
        }
    }).catch((error) => {
        console.log("Error getting document:", error);
    });
}

//Affectation à la lsite déroulante
function affectChannelToList(listeChaines) {
    listeChaines.forEach(channel => {
        selectBox.options.add(
            new Option(channel, channel, false)
        );
    });
}


selectBox.addEventListener('change', () => {
    //Appel de l'API youtube
    fetch(`https://www.googleapis.com/youtube/v3/search?key=AIzaSyAebvd-2-p33hyYnFlWGG_CCB0ewB80AQ8&q=${selectBox.value}&type=video&part=snippet,id&maxResults=1`)
        .then((resp) => {
            return resp.json()
        })
        .then((data) => {
            generateVideo(data.items);
        })
        .catch(() => {
            // catch any errors
        });
});

//Génération de la balise video
function generateVideo(videosListe) {
    let videoNode = document.querySelector("#gridVideos");
    //Suppression des enfants
    videoNode.innerHTML = "";

    videosListe.forEach(video => {
        let vid = document.createElement("video");
        //Création d'un attribut permettant le lien avec le script qui récupère l'URL de stream sur le serveur Google
        let a = document.createAttribute("data-yt2html5");
        a.value = 'https://www.youtube.com/watch?v=' + video.id.videoId
        vid.setAttributeNode(a);
        vid.controls = true;
        videoNode.appendChild(vid);
        //Rechargement de la bibliothèque
        window.player.load();
        vid.classList.add("video");
    });
}

//Bouton picture in picture évènement clic
document.querySelector('#btnPip').addEventListener("click", () => {
    togglePictureInPicture()
});

//Web API servant à transformer en picture-in-picture
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