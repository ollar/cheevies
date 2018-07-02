import { computed } from '@ember/object';
import Controller from '@ember/controller';
import ImageUploadMixin from '../../mixins/image-uploader';

export default Controller.extend(ImageUploadMixin, {
  image: computed.readOnly('model.image-set.256'),

  _uploadPath(image) {
    return `cheevies/${this.model.id}/${image.width}/${image.name}`;
  },

  actions: {
    updateCheevie() {
      this.get('model').save();
      this.transitionToRoute('index');
    },
    goBack() {
      this.model.deleteRecord();
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
