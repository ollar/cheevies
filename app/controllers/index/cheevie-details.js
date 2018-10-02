import Controller from '@ember/controller';
import { computed } from '@ember/object';
import ImageUploadMixin from '../../mixins/image-uploader';
import { inject as service } from '@ember/service';
import { resolve, all } from 'rsvp';

export default Controller.extend(ImageUploadMixin, {
    showMode: true,
    myGroup: service('my-group'),

    _model: computed.alias('model'),

    _file: null,
    image: computed.readOnly('model.image-set.512'),

    _image: computed('_file', 'image', function() {
        if (this._file) {
            return {
                url: window.URL.createObjectURL(this._file),
            };
        }
        return this.image;
    }),

    _uploadPath(image) {
        return `cheevies/${this.model.id}/${image.width}/${image.name}`;
    },

    restoreMode() {
        this.setProperties({
            _file: '',
        });
        this.set('showMode', true);
    },

    actions: {
        toggleMode() {
            this.model.rollbackAttributes();
            this.toggleProperty('showMode');
        },

        goBack() {
            this.model.rollbackAttributes();
            this.restoreMode();
            this.transitionToRoute('index');
        },

        uploadImage(files) {
            const file = files[0];
            if (!file || file.type.indexOf('image') < 0) return;
            this.set('_file', file);
        },
        removeImage() {
            if (this._file) {
                return this.setProperties({
                    _file: '',
                });
            }
            return this._removeImage(true);
        },
        updateCheevie() {
            return new Promise(resolve => {
                if (this._file) {
                    return resolve(this._uploadImage(this._file));
                }

                return resolve();
            })
                .then(() => this.get('model').save())
                .then(() => {
                    this.restoreMode();
                    this.send('goBack');
                });
        },
        deleteCheevie() {
            if (window.confirm(this.get('i18n').t('messages.delete_cheevie_check'))) {
                const group = this.myGroup.get('model');
                const model = this.get('model');
                return resolve()
                    .then(() => group.get('cheevies').removeObject(model))
                    .then(() => all([group.save(), model.destroyRecord()]))
                    .then(() => {
                        this.restoreMode();
                        this.transitionToRoute('index');
                    });
            }
        },
    },
});
