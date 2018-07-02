import Controller from '@ember/controller';
import { computed } from '@ember/object';
import ImageUploadMixin from '../../mixins/image-uploader';

export default Controller.extend(ImageUploadMixin, {
  showMode: true,

  image: computed.readOnly('model.image-set.256'),

  _uploadPath(image) {
    return `cheevies/${this.model.id}/${image.width}/${image.name}`;
  },

  restoreMode() {
    this.set('showMode', true);
  },

  actions: {
    toggleMode() {
      this.model.rollbackAttributes();
      this.toggleProperty('showMode');
    },

    // check this !!!!!!
    goBack() {
      this.model.rollbackAttributes();
      this.restoreMode();
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
    updateCheevie() {
      this.get('model').save();
      this.restoreMode();
      this.send('goBack');
    },
    deleteCheevie() {
      if (window.confirm(this.get('i18n').t('messages.delete_cheevie_check'))) {
        this.get('model').destroyRecord();
        this.transitionToRoute('index');
      }
    },
  },
});
