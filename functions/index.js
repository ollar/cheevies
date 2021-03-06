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

exports.removeImageSetOnCheevieModelDestroy = functions.database
    .ref('/cheevies/{id}')
    .onDelete(snapshot => {
        const cheevie = snapshot.val();
        const imageSet = cheevie['image-set'];

        if (imageSet) {
            return admin
                .database()
                .ref('/imageSets/' + imageSet)
                .remove();
        }
        return false;
    });

exports.removeImageModelsOnImageSetModelDestroy = functions.database
    .ref('/imageSets/{setId}')
    .onDelete(snapshot => {
        const imageSet = snapshot.val();

        if (imageSet) {
            return Promise.all(
                Object.keys(imageSet).map(setKey =>
                    admin
                        .database()
                        .ref('/images/' + imageSet[setKey])
                        .remove()
                )
            );
        }
        return false;
    });

exports.createUserModelOnSignUp = functions.auth.user().onCreate(user => {
    console.log(user);

    //     var { uid, email, displayName } = user;
    //     return admin
    //         .database()
    //         .ref('/users/' + uid)
    //         .set({
    //             name: displayName || 'newb',
    //             email,
    //             created: Date.now(),
    //         });
});

exports.removeUserModelOnDelete = functions.auth.user().onDelete(user => {
    var { uid } = user;
    return admin
        .database()
        .ref('/users/' + uid)
        .remove();
});

exports.removeUserFromGroupOnUserDelete = functions.database
    .ref('/users/{userId}')
    .onDelete((snapshot, event) => {
        const userId = event.params.userId;
        const user = snapshot.val();

        if (user.groups)
            Object.keys(user.groups).forEach(group => {
                console.log('group', group);
                admin
                    .database()
                    .ref('/groups/' + group + '/users/' + userId)
                    .remove();
            });
    });

exports.onAddCheevie = functions.database
    .ref('/users/{userId}/cheevies/{cheevieId}')
    .onCreate((cheevie, event) => {
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

        return Promise.all([getDeviceTokensPromise, getCheeviePromise]).then(results => {
            let fcmToken = results[0].val();
            let cheevie = results[1].val();

            if (!fcmToken) return;

            const payload = {
                notification: {
                    title: "Hooray! You've got new cheevie",
                    body: `"${cheevie.name}" is yours!`,
                    icon:
                        'https://firebasestorage.googleapis.com/v0/b/cheevies-jerk.appspot.com/o/firefox-general-128-128.png?alt=media&token=30387e8a-25d1-468c-89cb-f6a28cca5bde',
                    clickAction: 'https://cheevies.club',
                },
            };

            return admin.messaging().sendToDevice(fcmToken, payload);
        });
    });

exports.addUnseenCheevieOnAddCheevie = functions.database
    .ref('/users/{userId}/cheevies/{cheevieId}')
    .onCreate((snapshot, event) => {
        const userId = event.params.userId;
        const cheevieId = event.params.cheevieId;

        return admin
            .database()
            .ref('/users/' + userId + '/unseenCheevies')
            .update({
                [cheevieId]: true,
            });
    });
