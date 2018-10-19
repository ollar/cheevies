import { computed } from '@ember/object';
import Controller from '@ember/controller';
import ImageUploadMixin from '../../mixins/image-uploader';
import BusyMixin from '../../mixins/busy-loader';
import { all, resolve } from 'rsvp';
import { inject as service } from '@ember/service';

export default Controller.extend(ImageUploadMixin, BusyMixin, {
    activity: service(),
    _model: computed.alias('model.cheevie'),
    _file: null,
    _image: computed('_file', function() {
        if (this._file) {
            return {
                url: window.URL.createObjectURL(this._file),
            };
        }
    }),

    _uploadPath(image) {
        return `cheevies/${this._model.id}/${image.width}/${image.name}`;
    },

    actions: {
        updateCheevie() {
            this.setBusy(true);
            return resolve()
                .then(() => {
                    if (this._file) {
                        return this._uploadImage(this._file);
                    }

                    return true;
                })
                .then(() => {
                    const group = this.get('model.myGroup');
                    const model = this.get('_model');

                    model.set('group', group);
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
                .finally(() => this.setBusy(false));
        },
        goBack() {
            this._model.deleteRecord();
            this.setProperties({
                _file: '',
            });
            this.transitionToRoute('index');
        },
        uploadImage(files) {
            const file = files[0];
            if (!file || file.type.indexOf('image') < 0) return;
            this.set('_file', file);
        },

        removeImage() {
            this.setProperties({
                _file: '',
            });
        },
    },
});
