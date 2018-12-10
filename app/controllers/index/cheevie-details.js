import Controller from '@ember/controller';
import { computed } from '@ember/object';
import ImageUploadMixin from '../../mixins/image-uploader';
import BusyMixin from '../../mixins/busy-loader';
import { inject as service } from '@ember/service';
import { resolve } from 'rsvp';

export default Controller.extend(ImageUploadMixin, BusyMixin, {
    showMode: true,
    editMode: computed.not('showMode'),
    myGroup: service('my-group'),
    activity: service(),

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
            showMode: true,
        });
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
            if (!this._model.validate()) return;

            this.setBusy(true);

            return resolve()
                .then(() => {
                    if (this._file) {
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
                    this.restoreMode();
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
                        this.restoreMode();
                        this.transitionToRoute('index');
                    });
            }
        },
    },
});
