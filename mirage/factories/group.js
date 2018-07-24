import { Factory } from 'ember-cli-mirage';
import { computed } from '@ember/object';

export default Factory.extend({
  name: 'test',
  users: computed(() => []),
  cheevies: computed(() => []),
});
