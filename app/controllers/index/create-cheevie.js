import { computed } from '@ember/object';
import Controller from '@ember/controller';
import ImageUploadMixin from '../../mixins/image-uploader';

export default Controller.extend(ImageUploadMixin, {
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
    async updateCheevie() {
      if (this._file) {
        await this._uploadImage(this._file);
      }

      const group = this.get('model.myGroup');
      const model = this.get('_model');

      model.set('group', group);

      model.save();
      group.get('cheevies').pushObject(model);

      group.save();

      this.transitionToRoute('index');
    },
    goBack() {
      this._model.deleteRecord();
      this.setProperties({
        _file: null,
        _image: null,
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
        _file: null,
        _image: null,
      });
    },
  },
});
