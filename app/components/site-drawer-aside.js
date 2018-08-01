import Component from 'site-drawer-component/components/site-drawer-aside';
import { inject as service } from '@ember/service';
import { computed } from '@ember/object';

export default Component.extend({
  me: service(),
  avatar: computed.readOnly('me.model.image-set'),
  cheevies: computed.readOnly('me.model.cheevies'),
});
