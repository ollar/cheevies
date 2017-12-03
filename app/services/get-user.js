import Service, { inject as service } from '@ember/service';
import { computed } from '@ember/object';


export default Service.extend({
  session: service(),
  store: service(),
  user: computed.readOnly('session.me'),
});
