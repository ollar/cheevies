import Controller from '@ember/controller';
import { inject as service } from '@ember/service';
import { action } from '@ember/object';

import cordovaGetImage from 'cheevies/utils/cordova-get-image';

export default class ProfileController extends Controller {
    @service me;
    @service myGroup;
    @service intl;
    @service share;
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
        return this.groupCheevies;



        return []
    }





    @action
    showCheeviesPicker() {
        this.transitionToRoute('index.profile.give-cheevie');
    }

    @action
    cheevieDetails(cheevie) {
        return;
        const reference = document.querySelector(`#${cheevie.id}`);
        const popper = document.querySelector(`#${cheevie.id}_hint`);
        if (this.popper) this.popper.destroy();
        if (cheevie.id === this.openPopper) {
            $('.item-hint').hide();
            this.set('openPopper', '');
            return;
        }

        $('.item-hint').hide();
        $(popper).show();

        schedule('render', () => {
            this.popper = new Popper(reference, popper);
            this.set('openPopper', cheevie.id);
        });
    }

    @action
    closeCheevieDetails() {
        return;
        if (this.popper) this.popper.destroy();
        $('.item-hint').hide();
        this.set('openPopper', '');
        return;
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

    @action
    shareCheevie(cheevie) {
        const onSuccess = () => {
            return this.send('notify', {
                type: 'success',
                text: this.intl.t('share.messages.success'),
            });
        };

        const onError = () => {
            return this.send('notify', {
                type: 'error',
                text: this.intl.t('share.messages.error'),
            });
        };

        this.share
            .post({
                title: this.intl.t('share.cheevie.title'),
                text: this.intl.t('share.cheevie.text', { cheevie: cheevie.name }),
                url: `${this.share.appDomain}/profile/${this.model.id}`,
            })
            .then(() => onSuccess(), () => onError());
    }

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

    @action
    removeImage() {
        return this._removeImage(true);
    }
}
