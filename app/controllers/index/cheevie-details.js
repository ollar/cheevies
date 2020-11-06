import Controller from '@ember/controller';
import { inject as service } from '@ember/service';
import { tracked } from '@glimmer/tracking';
import { action } from '@ember/object';

import { userIsModerator, userIsGroupAuthor } from 'cheevies/utils/user-role';
import cordovaGetImage from 'cheevies/utils/cordova-get-image';

export default class IndexCheevieDetailsController extends Controller {
    @tracked showMode = true;
    @tracked showOptionalMenu = false;
    @tracked showGiphySelector = false;
    @tracked _file = null;
    @tracked _giphy = null;

    @service myGroup;
    @service activity;
    @service me;
    @service intl;
    @service giphy;


    get editMode() {
        return !this.showMode;
    }

    get myModel() {
        return this.me.model;
    }

    get groupModel() {
        return this.myGroup.model;
    }

    get _model() {
        return this.model;
    }

    get canEditCheevie() {
        if (!this.myModel || !this.groupModel) return false;
        return (
            this.groupModel.policy === 'anarchy' ||
            userIsGroupAuthor(this.groupModel, this.myModel) ||
            userIsModerator(this.groupModel, this.myModel)
        );
    }

    get image() {
        return this.model.get('image-set.512');
    }

    get _image() {
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
    }

    resetProperties() {
        this.showMode = true;
        this.showOptionalMenu = false;
        this.showGiphySelector = false;
        this._file = null;
        this._giphy = null;
    }

    _clearFile() {
        if (this._file) {
            this._file = null;
        } else if (this._giphy) {
            this.resetProperties();
        }
    }


    @action
    toggleMode() {
        this.model.rollbackAttributes();
        this.showMode = !this.showMode;
    }

    @action
    goBack() {
        this.model.rollbackAttributes();
        this.transitionToRoute('index');
    }

    @action
    chooseMethod(e) {
        e && e.preventDefault && e.preventDefault();
        this.showOptionalMenu = true;
    }

    @action
    selectGiphy() {
        this.showGiphySelector = true;
        this.showOptionalMenu = false;
    }

    @action
    closeOptionalMenu() {
        this.showOptionalMenu = false;
        this.showGiphySelector = false;
    }

    @action
    takeGiphy(giphy) {
        this._giphy = giphy;
    }

    @action
    removeImage() {
        this._clearFile();
        return this.giphy.removeImage(this.model, true);
    }

    @action
    selectUpload() {
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
                this.showOptionalMenu = false;
                this._file = _file;
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

        this.showOptionalMenu = false;
    }

    @action
    updateCheevie() {
        if (!this.model.validate()) return;

        // this.setBusy(true);

        return Promise.resolve()
            .then(() => {
                if (this._giphy) {
                    return this.giphy.saveGiphy(this._giphy, this.model);
                } else if (this._file) {
                    return this._uploadImage(this._file);
                }

                return true;
            })
            .then(() => this.model.save())
            .then(() =>
                this.activity.send({
                    cheevie: this.model,
                    action: 'updateCheevie',
                })
            )
            .then(() => {
                this.goBack();
            })
            // .finally(() => this.setBusy(false));
    }
    @action
    async deleteCheevie() {
        if (window.confirm(this.intl.t('messages.delete_cheevie_check'))) {
            this.groupModel.get('cheevies').removeObject(this.model);

            this.model.set('deleted', true);

            await this.model.save();
            await this.groupModel.save();

            this.transitionToRoute('index');
        }
    }


}
