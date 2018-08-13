import EmberObject, { computed } from '@ember/object';
import { resolve } from 'rsvp';

export const testGroup = EmberObject.extend({
  id: 'myGroup',
  name: 'test',
  users: computed(() => []),
  cheevies: computed(() => []),
  save() {
    return resolve();
  },
});

export const cheevieModel = EmberObject.extend({
  rates: computed(() => ['low', 'normal', 'high']),
  save() {
    return resolve();
  },
});
