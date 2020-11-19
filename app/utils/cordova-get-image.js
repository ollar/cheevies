export default function cordovaGetImage({ confirmStrings: { title, text, buttons = {} } }) {
    return new Promise((resolve, reject) => {
        const setOptions = srcType => {
            var options = {
                // Some common settings are 20, 50, and 100
                quality: 50,
                destinationType: window.Camera.DestinationType.FILE_URI,
                // In this app, dynamically set the picture source, Camera or photo gallery
                sourceType: srcType,
                encodingType: window.Camera.EncodingType.JPEG,
                mediaType: window.Camera.MediaType.PICTURE,
                // allowEdit: true,
                correctOrientation: true, //Corrects Android orientation quirks
            };
            return options;
        };

        navigator.notification.confirm(
            text.toString(),
            result => {
                if (!result || result === 3) return reject();

                var srcType =
                    result === 1
                        ? window.Camera.PictureSourceType.CAMERA
                        : window.Camera.PictureSourceType.SAVEDPHOTOALBUM;
                var options = setOptions(srcType);
                options.targetHeight = 512;
                options.targetWidth = 512;

                navigator.camera.getPicture(
                    imageUri => {
                        window.resolveLocalFileSystemURL(imageUri, fileEntry => {
                            fileEntry.file(file => {
                                var reader = new FileReader();

                                reader.onloadend = function() {
                                    const _file = new Blob([this.result], { type: 'image/jpg' });
                                    return resolve(_file);
                                };

                                reader.readAsArrayBuffer(file);
                            });
                        });
                    },
                    reject,
                    options
                );
            },
            title.toString(),
            [buttons.camera.toString(), buttons.gallery.toString(), buttons.cancel.toString()]
        );
    });
}
