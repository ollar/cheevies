import Controller from '@ember/controller';
import { computed } from '@ember/object';
import { inject as service } from '@ember/service';
import ImageUploadMixin from '../mixins/image-uploader';

export default Controller.extend(ImageUploadMixin, {
  me: service(),

  cheeviesPickerIsVisible: false,

  userId: computed.readOnly('model.id'),
  myId: computed.readOnly('me.model.id'),

  _uploadPath(image) {
    return `users/${this.model.id}/${image.width}/${image.name}`;
  },

  isMe: computed('userId', 'myId', function() {
    return this.get('userId') === this.get('myId');
  }),

  avatar: computed.readOnly('model.image-set.256'),

  actions: {
    showCheeviesPicker(value) {
      this.set('cheeviesPickerIsVisible', value);
    },

    uploadImage(files) {
      if (!this.get('isMe')) return;
      const file = files[0];

      if (!file || file.type.indexOf('image') < 0) return;

      return this._uploadImage(file);
    },

    removeImage() {
      return this._removeImage();
    },

    pickCheevie(cheevie) {
      this.model.get('cheevies').pushObject(cheevie);
      this.model.get('unseenCheevies').pushObject(cheevie);
      this.model.save();
      this.send('showCheeviesPicker', false);
    },

    refuseCheevie(cheevie) {
      this.model.get('cheevies').removeObject(cheevie);
      this.model.save();
    },
  },
});
