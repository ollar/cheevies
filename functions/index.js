const functions = require('firebase-functions');
const admin = require('firebase-admin');
admin.initializeApp(functions.config().firebase);

// // Create and Deploy Your First Cloud Functions
// // https://firebase.google.com/docs/functions/write-firebase-functions
//
// exports.helloWorld = functions.https.onRequest((request, response) => {
//  response.send("Hello from Firebase!");
// });

exports.onAddCheevie = functions.database.ref('/users/{userId}/cheevies').onUpdate(event => {
  const value = event.data.previous.val();
  const getDeviceTokensPromise = admin.database().ref(`/users/${userId}/fcmToken`).once('value');

  const payload = {
    notification: {
      title: 'You have a new cheevie!',
      // body: `${follower.displayName} is now following you.`,
      // icon: follower.photoURL
    }
  };

  console.log(value);
});