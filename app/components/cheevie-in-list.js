import Component from '@ember/component';
import { computed } from '@ember/object';

export default Component.extend({
  image: computed.readOnly('cheevie.image-set.64'),
});
