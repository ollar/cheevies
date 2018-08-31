import Controller from '@ember/controller';
import { computed } from '@ember/object';
import { inject as service } from '@ember/service';
import ImageUploadMixin from '../mixins/image-uploader';
import Popper from 'popper';
import $ from 'jquery';
import DS from 'ember-data';

export default Controller.extend(ImageUploadMixin, {
  me: service(),
  myGroup: service(),

  openPopper: '',

  userId: computed.readOnly('model.id'),
  myId: computed.readOnly('me.model.id'),

  cheevies: computed('model.cheevies.[]', function() {
    return DS.PromiseArray.create({
      promise: this.get('myGroup')
        .fetch()
        .then(myGroup => myGroup.get('cheevies'))
        .then(availableCheevies =>
          this.model.cheevies.filter(
            cheevie => availableCheevies.indexOf(cheevie) > -1
          )
        ),
    });
  }),

  _uploadPath(image) {
    return `users/${this.model.id}/${image.width}/${image.name}`;
  },

  isMe: computed('userId', 'myId', function() {
    return this.get('userId') === this.get('myId');
  }),

  avatar: computed.readOnly('model.image-set.512'),

  actions: {
    uploadImage(files) {
      if (!this.get('isMe')) return;
      const file = files[0];

      if (!file || file.type.indexOf('image') < 0) return;

      return this._uploadImage(file);
    },

    removeImage() {
      return this._removeImage(true);
    },

    refuseCheevie(cheevie) {
      this.model.get('cheevies').removeObject(cheevie);
      this.model.save();
    },

    closeCheevieDetails() {
      if (this.popper) this.popper.destroy();
      $('.item-hint').hide();
      this.set('openPopper', '');
      return;
    },

    cheevieDetails(cheevie) {
      const reference = document.querySelector(`#${cheevie.id}`);
      const popper = document.querySelector(`#${cheevie.id}_hint`);
      if (this.popper) this.popper.destroy();
      if (cheevie.id === this.openPopper) {
        $('.item-hint').hide();
        this.set('openPopper', '');
        return;
      }

      $('.item-hint').hide();
      $(popper).show();

      this.popper = new Popper(reference, popper);
      this.set('openPopper', cheevie.id);
    },

    showCheeviesPicker() {
      this.transitionToRoute('profile.give-cheevie');
    },
  },
});
