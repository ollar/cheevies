import { computed } from '@ember/object';
import Controller from '@ember/controller';
import ImageUploadMixin from '../../mixins/image-uploader';
import BusyMixin from '../../mixins/busy-loader';
import { all, resolve } from 'rsvp';
import { inject as service } from '@ember/service';

export default Controller.extend(ImageUploadMixin, BusyMixin, {
    activity: service(),
    me: service(),
    giphy: service(),

    _model: computed.alias('model.cheevie'),
    _image: computed('_file', function() {
        if (this._file) {
            return {
                url: window.URL.createObjectURL(this._file),
            };
        }
    }),

    hasChangedAttributes: computed('_model.{name,description}', '_file', function() {
        return Boolean(Object.keys(this._model.changedAttributes()).length);
    }),

    init() {
        this._super(...arguments);
        this.resetProperties();
    },

    _uploadPath(image) {
        return `cheevies/${this._model.id}/${image.width}/${image.name}`;
    },

    _clearFile() {
        if (this._file) {
            window.URL.revokeObjectURL(this._file);
            this.set('_file', '');
        } else if (this._giphy) {
            this.resetProperties();
        }
    },

    resetProperties() {
        this.setProperties({
            showOptionalMenu: false,
            showGiphySelector: false,
            _file: null,
            _giphy: null,
            _image: null,
        });
    },

    actions: {
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
                .then(() => {
                    const group = this.get('model.myGroup');
                    const model = this.get('_model');

                    model.set('group', group);
                    model.set('author', this.me.model);
                    group.get('cheevies').pushObject(model);
                    return all([model.save(), group.save()]).then(() =>
                        this.transitionToRoute('index')
                    );
                })
                .then(() =>
                    this.activity.send({
                        cheevie: this.get('_model'),
                        action: 'createCheevie',
                    })
                )
                .then(() => this._clearFile())
                .finally(() => this.setBusy(false));
        },
        goBack() {
            this.send('closeOptionalMenu');
            this._model.deleteRecord();
            this._clearFile();
            this.transitionToRoute('index');
        },
        uploadImage(files) {
            const file = files[0];
            if (!file || file.type.indexOf('image') < 0) return;
            this.set('_file', file);
        },

        removeImage() {
            this._clearFile();
        },

        chooseMethod() {
            this.toggleProperty('showOptionalMenu');
        },

        selectGiphy() {
            this.toggleProperty('showGiphySelector');
            this.toggleProperty('showOptionalMenu');
        },

        selectUpload() {
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
            this.setProperties({
                _image: {
                    url: this.getWithDefault.call(giphy, 'images.original.webp', ''),
                },
                _giphy: giphy,
            });
        },
    },
});
