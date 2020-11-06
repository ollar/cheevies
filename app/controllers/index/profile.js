import Controller from '@ember/controller';
import { inject as service } from '@ember/service';
import { action } from '@ember/object';

import cordovaGetImage from 'cheevies/utils/cordova-get-image';

export default class ProfileController extends Controller {
    @service me;
    @service myGroup;
    @service intl;
    @service activity;

    get userId() {
        return this.model.id;
    }

    get myId() {
        return this.me.model.id;
    }

    get isMe() {
        return this.userId === this.myId;
    }

    get isShareAvailable() {
        return this.share.isAvailable;
    }

    _uploadPath(image) {
        return `users/${this.model.id}/${image.width}/${image.name}`;
    }

    get groupCheevies() {
        return this.myGroup.model.cheevies;
    }

    get userCheevies() {
        return this.model.cheevies;
    }

    get cheevies() {
        return this.userCheevies.filter(cheevie => this.groupCheevies.includes(cheevie));
    }

    @action
    showCheeviesPicker() {
        this.transitionToRoute('index.profile.give-cheevie');
    }

    // todo fix me
    @action
    handleInputClick() {
        if (window.cordova) {
            cordovaGetImage({
                confirmStrings: {
                    title: this.intl.t('cordova-get-image.modal.title'),
                    text: this.intl.t('cordova-get-image.modal.text'),
                    buttons: {
                        camera: this.intl.t('cordova-get-image.modal.buttons.camera'),
                        gallery: this.intl.t('cordova-get-image.modal.buttons.gallery'),
                        cancel: this.intl.t('cordova-get-image.modal.buttons.cancel'),
                    },
                },
            }).then(_file => {
                this.send('uploadImage', [_file]);
            });

            return;
        }

        this._fileInput = document.querySelector('input[type="file"]');
        if (this._fileInput) {
            this._fileInput.dispatchEvent(
                new MouseEvent('click', {
                    view: window,
                    bubbles: false,
                    cancelable: true,
                })
            );
        }
    }

    // todo fix me
    @action
    refuseCheevie(cheevie) {
        this.model.get('cheevies').removeObject(cheevie);
        this.model.save().then(() =>
            this.activity.send({
                cheevie,
                action: 'refuseCheevie',
            })
        );
    }

    // todo fix me
    @action
    uploadImage(files) {
        if (!this.isMe) return;
        const file = files[0];

        if (!file || file.type.indexOf('image') < 0) return;

        this.setBusy(true);

        return this._uploadImage(file).finally(() => {
            this.setBusy(false);
        });
    }

    // todo fix me
    @action
    removeImage() {
        return this._removeImage(true);
    }
}
