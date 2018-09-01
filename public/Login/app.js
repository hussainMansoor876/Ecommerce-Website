// const messaging = firebase.messaging();
imagesArray = []
for (var i = 0; i <= 11; i++) {
    imagesArray[i] = `hd/${i}.jpg`
}
// console.log(imagesArray)

var cardContainer = document.getElementById('cardContainer')
cardContainer.innerHTML = imagesArray.map(createCards).join('\t')

function createCards(image) {
    return `
        <div class="card">
            <div class="img">
                <img src="${image}" alt="card">
            </div>
        </div>`
}
if ('serviceWorker' in navigator) {
    try {
        navigator.serviceWorker.register('../sw.js')
            .then((registration) => {
                messaging.useServiceWorker(registration)
                console.log('service worker')
                console.log(messaging)
            })
    } catch (error) {
        console.log(error)
    }
}

function logout() {
    firebase.auth().signOut().then(function () {
        // Sign-out successful.
        swal("Sign-out successful")
        window.location = './Login/login.html'
    }).catch(function (error) {
        // An error happened.
    });
}

// firebase.auth().onAuthStateChanged(function (user) {
//     if (user) {
//         console.log(user.email)
//         messaging.requestPermission()
//             .then(function () {
//                 console.log('Permission Allowed')
//                 return messaging.getToken();
//             })
//             .then((token) => {
//                 // console.log(token)
//                 console.log('Got FCM device token:', token);
//                 // console.log(user.uid)
//                 firebase.database().ref('fcmTokens').child(token).set(user.uid);
//             })
//             .catch(function (error) {
//                 console.log('Unable to get permission to notify.', error);
//                 alert("Your Notifications Are Disabled")
//             });
//     }
// })