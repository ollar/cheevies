import Component from '@ember/component';
import { computed } from '@ember/object';

export default Component.extend({
  avatar: computed.readOnly('user.image-set.128'),
  didInsertElement() {},
});
