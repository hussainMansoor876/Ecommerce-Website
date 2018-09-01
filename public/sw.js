var cacheName = 'OLX-Pakistan'
const staticAssets = [
    './',
    './media.png',
    './index.html',
    './index1.html',
    './style.css',
    './Login/localforage.min.js',
    './Login/index.html',
    './Login/login.html',
    './Login/app1.js',
    './Login/app.js',
    './Login/reg.js',
    './Login/post.html',
    './Login/user.html',
    './Login/style.css',
    './Login/post/style.css',
    './Login/post/app.js',
    './hd/0.jpg',
    './hd/1.jpg',
    './hd/2.jpg',
    './hd/3.jpg',
    './hd/4.jpg',
    './hd/5.jpg',
    './hd/6.jpg',
    './hd/7.jpg',
    './hd/8.jpg',
    './hd/9.jpg',
    './hd/10.jpg',
    './hd/11.jpg',
    './hd/download.jpg',
    './hd/back.jpg',
    './Login/post/app.js',
    './Login/post/style.css',
    './Login/post/chatapp/app.js',
    './Login/post/chatapp/chat.html',
    './Login/post/chatapp/style.css',
    './Bootstrap/bootstrap.js',
    './Bootstrap/bootstrap.min.css',
    './Bootstrap/jquery.min.js',
]

self.addEventListener('install', event => {
    event.waitUntil(
        caches.open(cacheName).then(function (cache) {
            console.log('[ServiceWorker] Caching app shell');
            return cache.addAll(staticAssets);
        })
    );
})
self.addEventListener('fetch', event => {
    const req = event.request;
    const url = new URL(req.url);
    if (url.origin === location.origin) {
        event.respondWith(cacheFirst(req))
    }
    // else {
    //     event.respondWith(networkFirst(req))
    // }
})

async function cacheFirst(req) {
    const cacheResponse = await caches.match(req);
    return cacheResponse || fetch(req);
}

// async function networkFirst(req) {
//     const cache = await caches.open(cacheName);
//     try {
//         const res = await fetch(req);
//         cache.put(req, res.clone())
//         return res
//     } catch (error) {
//         return await cache.match(req)
//     }
// }
/* ======================== PUSH NOTIFICATION ======================== */
/* ============================== START ============================== */

importScripts('https://www.gstatic.com/firebasejs/5.0.0/firebase-app.js');
importScripts('https://www.gstatic.com/firebasejs/5.0.0/firebase-messaging.js');

// Initialize Firebase
var config = {
    apiKey: "AIzaSyD-z5rfwEIeUgNjKm9wuSIJxQmx4TBR6Hk",
    authDomain: "saylani-hakathon.firebaseapp.com",
    databaseURL: "https://saylani-hakathon.firebaseio.com",
    projectId: "saylani-hakathon",
    storageBucket: "saylani-hakathon.appspot.com",
    messagingSenderId: "571057649825"
};
firebase.initializeApp(config);
// Initialize the Firebase app in the service worker by passing in the
// importScripts('/__/firebase/init.js');
// messagingSenderId.
// Retrieve an instance of Firebase Messaging so that it can handle background
// messages.
const messaging = firebase.messaging();

// If you would like to customize notifications that are received in the
// background (Web app is closed or not in browser focus) then you should
// implement this optional method.
// [START background_handler]
messaging.setBackgroundMessageHandler(function (payload) {
    console.log('[sw.js] Received background message ', payload);
    // Customize notification here
    var notification = payload.notification
    var notificationTitle = notification.title;
    var notificationOptions = {
        body: notification.body,
        icon: './media.png'
    };

    return self.registration.showNotification(notificationTitle,
        notificationOptions);
});
// [END background_handler]


/* ======================== PUSH NOTIFICATION ======================== */
/* =============================== END =============================== */