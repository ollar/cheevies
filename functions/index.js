const functions = require('firebase-functions');
const admin = require('firebase-admin');
admin.initializeApp(functions.config().firebase);
const storageBucket = 'cheevies-jerk.appspot.com';

// // Create and Deploy Your First Cloud Functions
// // https://firebase.google.com/docs/functions/write-firebase-functions
//
// exports.helloWorld = functions.https.onRequest((request, response) => {
//  response.send("Hello from Firebase!");
// });

exports.removeImageFileOnModelDestroy = functions.database
  .ref('/images/{imageId}')
  .onDelete(snapshot => {
    const value = snapshot.val();

    if (value) {
      return admin
        .storage()
        .bucket(storageBucket)
        .file(value.fullPath)
        .delete();
    }
    return false;
  });

exports.onAddCheevie = functions.database
  .ref('/users/{userId}/cheevies/{cheevieId}')
  .onCreate(event => {
    const userId = event.params.userId;
    const cheevieId = event.params.cheevieId;

    const getDeviceTokensPromise = admin
      .database()
      .ref(`/users/${userId}/fcmToken`)
      .once('value');
    const getCheeviePromise = admin
      .database()
      .ref(`/cheevies/${cheevieId}`)
      .once('value');

    return Promise.all([getDeviceTokensPromise, getCheeviePromise]).then(
      results => {
        let fcmToken = results[0].val();
        let cheevie = results[1].val();

        if (!fcmToken) return;

        const payload = {
          notification: {
            title: 'У тебя новая ачивка!',
            body: `"${cheevie.name}" теперь твоя!`,
            image: cheevie.imageUrl,
            icon: cheevie.imageUrl,
            // icon: '/manifest_icons/icon_192.png',
            // badge: '/manifest_icons/icon_192.png',
          },
        };

        return admin.messaging().sendToDevice(fcmToken, payload);
      }
    );
  });
