import Component from '@ember/component';
import { computed } from '@ember/object';
// import HaoticMoveMixin from '../mixins/haotic-move';

import { inject as service } from '@ember/service';

export default Component.extend(
    /*HaoticMoveMixin,*/ {
        me: service(),
        imageSet: computed.readOnly('cheevie.image-set'),

        id: computed('cheevie.id', function() {
            return [this.cheevie.id];
        }),
        myCheevies: computed(function() {
            return this.me.model.cheevies.mapBy('id');
        }),
        _isMineArr: computed.intersect('id', 'myCheevies'),
        isMine: computed.notEmpty('_isMineArr'),

        image: computed('imageSet.{}', function() {
            if (!this.get('imageSet.64')) return null;
            return {
                sm: this.get('imageSet.64'),
                md: this.get('imageSet.128'),
                lg: this.get('imageSet.256'),
            };
        }),
    }
);
