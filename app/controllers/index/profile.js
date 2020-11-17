import Controller from '@ember/controller';
import { inject as service } from '@ember/service';
import { action } from '@ember/object';
import { tracked } from '@glimmer/tracking';

import cordovaGetImage from 'cheevies/utils/cordova-get-image';

export default class ProfileController extends Controller {
    @tracked busy = false;

    @service me;
    @service myGroup;
    @service intl;
    @service activity;
    @service imageProcessor;

    get image() {
        const user = this.model;
        if (!user.get('image-set.256')) return null;
        return {
            sm: user.get('image-set.256'),
            md: user.get('image-set.256'),
            lg: user.get('image-set.512'),
        };
    }

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
                this.uploadImage([_file]);
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

    @action
    uploadImage(files) {
        if (!this.isMe) return;
        const file = files[0];

        if (!file || file.type.indexOf('image') < 0) return;

        this.busy = true;

        return this.imageProcessor.saveFile(file, this.model)
            .then(() => this.model.save())
            .finally(() => {
                this.busy = false;
            });
    }

    // todo fix me
    @action
    removeImage() {
        return this.imageProcessor.removeImage(this.model, true);
    }
}
