import { computed } from '@ember/object';
import Controller from '@ember/controller';
import ImageUploadMixin from '../../mixins/image-uploader';

export default Controller.extend(ImageUploadMixin, {
  _model: computed.alias('model.cheevie'),
  image: computed.readOnly('_model.image-set.256'),

  _uploadPath(image) {
    return `cheevies/${this._model.id}/${image.width}/${image.name}`;
  },

  actions: {
    updateCheevie() {
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
      this.transitionToRoute('index');
    },
    uploadImage(files) {
      const file = files[0];
      if (!file || file.type.indexOf('image') < 0) return;
      return this._uploadImage(file);
    },

    removeImage() {
      return this._removeImage();
    },
  },
});
