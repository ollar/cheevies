import Controller from '@ember/controller';
import { computed } from '@ember/object';
import { inject as service } from '@ember/service';
import ImageUploadMixin from '../mixins/image-uploader';
import BusyMixin from '../mixins/busy-loader';
import Popper from 'popper';
import $ from 'jquery';
import DS from 'ember-data';

export default Controller.extend(ImageUploadMixin, BusyMixin, {
    me: service(),
    myGroup: service(),

    openPopper: '',

    userId: computed.readOnly('model.id'),
    myId: computed.readOnly('me.model.id'),

    _model: computed.alias('model'),

    _cheevies: computed('model.cheevies.[]', function() {
        return DS.PromiseArray.create({
            promise: this.get('myGroup')
                .fetch()
                .then(myGroup => myGroup.get('cheevies'))
                .then(availableCheevies =>
                    this.model.cheevies.filter(cheevie => availableCheevies.indexOf(cheevie) > -1)
                ),
        });
    }),

    cheevies: computed('_cheevies.isFulfilled', function() {
        return this._cheevies;
    }),

    _uploadPath(image) {
        return `users/${this.model.id}/${image.width}/${image.name}`;
    },

    isMe: computed('userId', 'myId', function() {
        return this.get('userId') === this.get('myId');
    }),

    imageSet: computed.readOnly('model.image-set'),
    avatar: computed('model.image-set.{256,512}', function() {
        if (!this.get('imageSet.256')) return null;

        return {
            sm: this.get('imageSet.256'),
            md: this.get('imageSet.512'),
        };
    }),

    actions: {
        uploadImage(files) {
            if (!this.get('isMe')) return;
            const file = files[0];

            if (!file || file.type.indexOf('image') < 0) return;

            this.setBusy(true);

            return this._uploadImage(file).finally(() => {
                this.setBusy(false);
            });
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
