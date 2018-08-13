import Controller from '@ember/controller';
import { computed } from '@ember/object';
import ImageUploadMixin from '../../mixins/image-uploader';
import { inject as service } from '@ember/service';

export default Controller.extend(ImageUploadMixin, {
  showMode: true,
  myGroup: service(),

  _model: computed.alias('model'),

  _file: null,
  image: computed.readOnly('model.image-set.512'),

  _image: computed('_file.{name}', 'image', function() {
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
      _file: null,
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
          _file: null,
          _image: null,
        });
      }
      return this._removeImage();
    },
    async updateCheevie() {
      if (this._file) {
        await this._uploadImage(this._file);
      }

      this.get('model').save();
      this.restoreMode();
      this.send('goBack');
    },
    async deleteCheevie() {
      if (window.confirm(this.get('i18n').t('messages.delete_cheevie_check'))) {
        const group = this.myGroup.get('model');
        group.get('cheevies').removeObject(this.get('model'));

        await group.save();

        this.get('model').destroyRecord();
        this.restoreMode();
        this.transitionToRoute('index');
      }
    },
  },
});
