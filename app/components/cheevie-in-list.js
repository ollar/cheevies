import Component from '@ember/component';
import { computed } from '@ember/object';
// import HaoticMoveMixin from '../mixins/haotic-move';

export default Component.extend(
    /*HaoticMoveMixin,*/ {
        imageSet: computed.readOnly('cheevie.image-set'),
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
