// Import and configure the Firebase SDK
// These scripts are made available when the app is served or deployed on Firebase Hosting
// If you do not serve/host your project using Firebase Hosting see https://firebase.google.com/docs/web/setup
importScripts('https://www.gstatic.com/firebasejs/4.8.2/firebase-app.js');
importScripts('https://www.gstatic.com/firebasejs/4.8.2/firebase-messaging.js');

var config = {
  apiKey: "AIzaSyDpGDsbRoqDolu4g6fXwBO53wP6F7it6QQ",
  authDomain: "cheevies-jerk.firebaseapp.com",
  databaseURL: "https://cheevies-jerk.firebaseio.com",
  projectId: "cheevies-jerk",
  storageBucket: "cheevies-jerk.appspot.com",
  messagingSenderId: "819055703445"
};

firebase.initializeApp(config);
const messaging = firebase.messaging();