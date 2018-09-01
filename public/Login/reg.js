const messaging = firebase.messaging();
var currentUser = localStorage.getItem('currentUser')

firebase.auth().onAuthStateChanged(function (user) {
    if (user) {
        console.log(user.email)
        messaging.requestPermission()
            .then(function () {
                console.log('Permission Allowed')
                loadOffline()
                return messaging.getToken();
            })
            .then((token) => {
                // console.log(token)
                console.log('Got FCM device token:', token);
                // console.log(user.uid)
                firebase.database().ref('fcmTokens').child(token).set(user.uid);
            })
            // .catch(function (error) {
            //     console.log('Unable to get permission to notify.', error);
            //     alert("Your Notifications Are Disabled")
            // });
    }
})

messaging.onMessage((payload) => {
    console.log('onMessaging : ' + payload);
})

// Offline Data

function loadOffline() {
    var allData = []
    firebase.database().ref('offline').child(currentUser).once('value', (obj) => {
        // var obj = obj.key
        var obj = obj.val()
        console.log(obj)
        // allData.push(obj)
        for (var key in obj) {
            allData.push(obj[key])
        }
        console.log(allData)
        localforage.setItem('objData', allData)
    })
}


// localforage.getItem('obj', function(err, value) {
//     // Run this code once the value has been
//     // loaded from the offline store.
//     console.log(value);
// });