// Import and configure the Firebase SDK
// These scripts are made available when the app is served or deployed on Firebase Hosting
// If you do not serve/host your project using Firebase Hosting see https://firebase.google.com/docs/web/setup
importScripts('https://www.gstatic.com/firebasejs/4.8.2/firebase-app.js');
importScripts('https://www.gstatic.com/firebasejs/4.8.2/firebase-messaging.js');

var config = {
    apiKey: 'AIzaSyDpGDsbRoqDolu4g6fXwBO53wP6F7it6QQ',
    authDomain: 'cheevies-jerk.firebaseapp.com',
    databaseURL: 'https://cheevies-jerk.firebaseio.com',
    projectId: 'cheevies-jerk',
    storageBucket: 'cheevies-jerk.appspot.com',
    messagingSenderId: '819055703445',
};

firebase.initializeApp(config);
const messaging = firebase.messaging();

// If you would like to customize notifications that are received in the
// background (Web app is closed or not in browser focus) then you should
// implement this optional method.
// [START background_handler]
messaging.setBackgroundMessageHandler(function(payload) {
    // Customize notification here
    const notificationTitle = payload.notification.title;
    const notificationOptions = {
        title: payload.notification.title,
        body: payload.notification.body,
        icon: payload.notification.icon,
    };

    return self.registration.showNotification(notificationTitle, notificationOptions);
});

// self.addEventListener('notificationclick', function(event) {
//     event.notification.close();
//     event.waitUntil(event.target.launch());
// });
