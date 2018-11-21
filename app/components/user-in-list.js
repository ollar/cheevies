import Component from '@ember/component';
import { computed } from '@ember/object';
import HaoticMoveMixin from '../mixins/haotic-move';
import { inject as service } from '@ember/service';
import DS from 'ember-data';

export default Component.extend(HaoticMoveMixin, {
    myGroup: service('my-group'),

    cheevies: computed('model.cheevies.[]', function() {
        return DS.PromiseArray.create({
            promise: this.myGroup
                .fetch()
                .then(() => this.myGroup.cheevies)
                .then(availableCheevies =>
                    this.user.cheevies.filter(cheevie => availableCheevies.indexOf(cheevie) > -1)
                ),
        });
    }),

    classNames: ['user-in-list'],
    imageSet: computed.readOnly('user.image-set'),
    image: computed('imageSet.{}', function() {
        if (!this.get('imageSet.128')) return null;
        return {
            sm: this.get('imageSet.128'),
            md: this.get('imageSet.256'),
            lg: this.get('imageSet.512'),
        };
    }),
});
