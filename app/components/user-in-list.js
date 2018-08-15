import Component from '@ember/component';
import { computed } from '@ember/object';
import HaoticMoveMixin from '../mixins/haotic-move';

export default Component.extend(HaoticMoveMixin, {
  classNames: ['user-in-list'],
  avatar: computed.readOnly('user.image-set.128'),
});
