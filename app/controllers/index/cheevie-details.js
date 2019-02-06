import Controller from '@ember/controller';
import { computed } from '@ember/object';
import ImageUploadMixin from '../../mixins/image-uploader';
import BusyMixin from '../../mixins/busy-loader';
import { inject as service } from '@ember/service';
import { resolve } from 'rsvp';

import { userIsModerator, userIsGroupAuthor } from '../../utils/user-role';
import cordovaGetImage from '../../utils/cordova-get-image';

export default Controller.extend(ImageUploadMixin, BusyMixin, {
    showMode: true,
    editMode: computed.not('showMode'),
    myGroup: service('my-group'),
    activity: service(),
    me: service(),

    myModel: computed.readOnly('me.model'),
    groupModel: computed.readOnly('myGroup.model'),

    canEditCheevie: computed('myModel.id', 'groupModel.id', function() {
        if (!this.myModel || !this.groupModel) return false;
        return (
            this.groupModel.policy === 'anarchy' ||
            userIsGroupAuthor(this.groupModel, this.myModel) ||
            userIsModerator(this.groupModel, this.myModel)
        );
    }),

    _model: computed.alias('model'),

    _file: null,
    _giphy: null,

    image: computed.readOnly('model.image-set.512'),

    _image: computed('_file', '_giphy', 'image', function() {
        if (this._file) {
            return {
                url: window.URL.createObjectURL(this._file),
            };
        } else if (this._giphy) {
            return {
                url: this.getWithDefault.call(this._giphy, 'images.original.url', ''),
            };
        }
        return this.image;
    }),

    _uploadPath(image) {
        return `cheevies/${this.model.id}/${image.width}/${image.name}`;
    },

    resetProperties() {
        this.setProperties({
            showMode: true,
            showOptionalMenu: false,
            showGiphySelector: false,
            _file: null,
            _giphy: null,
        });
    },

    _clearFile() {
        if (this._file) {
            this.set('_file', '');
        } else if (this._giphy) {
            this.resetProperties();
        }
    },

    actions: {
        toggleMode() {
            this.model.rollbackAttributes();
            this.toggleProperty('showMode');
        },

        goBack() {
            this.model.rollbackAttributes();
            this.transitionToRoute('index');
        },

        uploadImage(files) {
            const file = files[0];
            if (!file || file.type.indexOf('image') < 0) return;
            this.set('_file', file);
        },
        removeImage() {
            this._clearFile();
            return this._removeImage(true);
        },
        updateCheevie() {
            if (!this._model.validate()) return;

            this.setBusy(true);

            return resolve()
                .then(() => {
                    if (this._giphy) {
                        return this._saveGiphy(this._giphy);
                    } else if (this._file) {
                        return this._uploadImage(this._file);
                    }

                    return true;
                })
                .then(() => this.get('model').save())
                .then(() =>
                    this.activity.send({
                        cheevie: this.get('_model'),
                        action: 'updateCheevie',
                    })
                )
                .then(() => {
                    this.send('goBack');
                })
                .finally(() => this.setBusy(false));
        },
        deleteCheevie() {
            if (window.confirm(this.get('i18n').t('messages.delete_cheevie_check'))) {
                const model = this.get('model');
                model.set('deleted', true);

                return resolve()
                    .then(() => model.save())
                    .then(() => {
                        this.transitionToRoute('index');
                    });
            }
        },

        chooseMethod() {
            this.toggleProperty('showOptionalMenu');
        },

        selectGiphy() {
            this.toggleProperty('showGiphySelector');
            this.toggleProperty('showOptionalMenu');
        },

        selectUpload() {
            if (window.cordova) {
                cordovaGetImage().then(_file => {
                    this.toggleProperty('showOptionalMenu');
                    this.set('_file', _file);
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

            this.toggleProperty('showOptionalMenu');
        },

        closeOptionalMenu() {
            this.set('showOptionalMenu', false);
            this.set('showGiphySelector', false);
        },

        takeGiphy(giphy) {
            this.set('_giphy', giphy);
        },
    },
});
