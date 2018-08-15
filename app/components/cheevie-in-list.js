import Component from '@ember/component';
import { computed } from '@ember/object';
import HaoticMoveMixin from '../mixins/haotic-move';

export default Component.extend(HaoticMoveMixin, {
  image: computed.readOnly('cheevie.image-set.64'),
});
