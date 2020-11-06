import Controller from '@ember/controller';
import { inject as service } from '@ember/service';
import { tracked } from '@glimmer/tracking';
import { action } from '@ember/object';
import cordovaGetImage from 'cheevies/utils/cordova-get-image';

export default class IndexCreateCheevieController extends Controller {
    @tracked showMode = true;
    @tracked showOptionalMenu = false;
    @tracked showGiphySelector = false;
    @tracked _file = null;
    @tracked _giphy = null;

    @service activity;
    @service me;
    @service giphy;
    @service intl;
    @service myGroup;



    get groupModel() {
        return this.myGroup.model;
    }

    get _model() {
        return this.model.cheevie;
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

    get hasChangedAttributes() {

        return Boolean(Object.keys(this._model.changedAttributes()).length);
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
    goBack() {
        this.closeOptionalMenu();
        this._model.deleteRecord();
        this._clearFile();
        this.transitionToRoute('index');
    }

    @action
    closeOptionalMenu() {
        this.set('showOptionalMenu', false);
        this.set('showGiphySelector', false);
    }

    @action
    takeGiphy(giphy) {
        this._giphy = giphy;
    }

    @action
    removeImage() {
        this._clearFile();
        // todo fix me
        // return this._removeImage(true);
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
    uploadImage(files) {
        const file = files[0];
        if (!file || file.type.indexOf('image') < 0) return;
        this._file = file;
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
    async updateCheevie() {
        if (!this._model.validate()) return;

        // this.setBusy(true);

        return Promise.resolve()
            .then(() => {
                if (this._giphy) {
                    return this.giphy.saveGiphy(this._giphy, this._model);
                }// else if (this._file) {
            //         return this._uploadImage(this._file);
            //     }

            //     return true;
            })
            .then(async () => {
                const model = this._model;

                model.set('group', this.groupModel);
                model.set('author', this.me.model);

                await model.save();

                this.groupModel.get('cheevies').pushObject(model);
                return this.groupModel.save().then(() =>
                    this.transitionToRoute('index')
                );
            })
            .then(() =>
                this.activity.send({
                    cheevie: this._model,
                    action: 'createCheevie',
                })
            )
            .then(() => this._clearFile())
            // .finally(() => this.setBusy(false));
    }
}
