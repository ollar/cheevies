import Component from '@ember/component';
import { computed } from '@ember/object';

export default Component.extend({
  classNames: ['user-in-list'],
  avatar: computed.readOnly('user.image-set.128'),
});
