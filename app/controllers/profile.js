import Controller from '@ember/controller';
import { computed } from '@ember/object';
import { inject as service } from '@ember/service';
import ImageUploadMixin from '../mixins/image-uploader';
import BusyMixin from '../mixins/busy-loader';
import Popper from 'popper';
import $ from 'jquery';
import DS from 'ember-data';
import { schedule } from '@ember/runloop';
import cordovaGetImage from '../utils/cordova-get-image';

export default Controller.extend(ImageUploadMixin, BusyMixin, {
    me: service(),
    myGroup: service(),
    activity: service(),
    share: service(),
    i18n: service(),

    openPopper: '',

    userId: computed.readOnly('model.id'),
    myId: computed.readOnly('me.model.id'),
    isShareAvailable: computed.readOnly('share.isAvailable'),

    _model: computed.alias('model'),

    _cheeviesPromise: computed('model.cheevies.[]', function() {
        return DS.PromiseArray.create({
            promise: this.myGroup
                .fetch()
                .then(() => this.myGroup.cheevies)
                .then(availableCheevies =>
                    this.model.cheevies.filter(cheevie => availableCheevies.indexOf(cheevie) > -1)
                ),
        });
    }),

    cheevies: computed('_cheeviesPromise.isFulfilled', function() {
        return this._cheeviesPromise;
    }),

    _uploadPath(image) {
        return `users/${this.model.id}/${image.width}/${image.name}`;
    },

    isMe: computed('userId', 'myId', function() {
        return this.get('userId') === this.get('myId');
    }),

    imageSet: computed.readOnly('model.image-set'),
    avatar: computed('model.image-set.{256,512}', function() {
        if (!this.get('imageSet.256')) return null;

        return {
            sm: this.get('imageSet.256'),
            md: this.get('imageSet.512'),
        };
    }),

    actions: {
        uploadImage(files) {
            if (!this.get('isMe')) return;
            const file = files[0];

            if (!file || file.type.indexOf('image') < 0) return;

            this.setBusy(true);

            return this._uploadImage(file).finally(() => {
                this.setBusy(false);
            });
        },

        removeImage() {
            return this._removeImage(true);
        },

        refuseCheevie(cheevie) {
            this.model.get('cheevies').removeObject(cheevie);
            this.model.save().then(() =>
                this.activity.send({
                    cheevie,
                    action: 'refuseCheevie',
                })
            );
        },

        shareCheevie(cheevie) {
            const onSuccess = () => {
                return this.send('notify', {
                    type: 'success',
                    text: this.i18n.t('share.messages.success'),
                });
            };

            const onError = () => {
                return this.send('notify', {
                    type: 'error',
                    text: this.i18n.t('share.messages.error'),
                });
            };

            this.share
                .post({
                    title: this.i18n.t('share.cheevie.title'),
                    text: this.i18n.t('share.cheevie.text', { cheevie: cheevie.name }),
                    url: `${this.share.appDomain}/profile/${this.model.id}`,
                })
                .then(() => onSuccess(), () => onError());
        },

        closeCheevieDetails() {
            if (this.popper) this.popper.destroy();
            $('.item-hint').hide();
            this.set('openPopper', '');
            return;
        },

        cheevieDetails(cheevie) {
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
        },

        showCheeviesPicker() {
            this.transitionToRoute('profile.give-cheevie');
        },

        handleInputClick() {
            if (window.cordova) {
                cordovaGetImage({
                    confirmStrings: {
                        title: this.i18n.t('cordova-get-image.modal.title'),
                        text: this.i18n.t('cordova-get-image.modal.text'),
                        buttons: {
                            camera: this.i18n.t('cordova-get-image.modal.buttons.camera'),
                            gallery: this.i18n.t('cordova-get-image.modal.buttons.gallery'),
                            cancel: this.i18n.t('cordova-get-image.modal.buttons.cancel'),
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
        },
    },
});
