import EmberObject, { computed } from '@ember/object';
import { resolve } from 'rsvp';
import Service from '@ember/service';

export const testGroup = EmberObject.extend({
  id: 'myGroup',
  name: 'test',
  users: computed(() => []),
  cheevies: computed(() => []),
  save() {
    return resolve();
  },
});

export const myGroupStub = Service.extend({
  groupName: 'test',
  model: testGroup.create(),
  fetch() {
    return resolve(this.model);
  },
});

export const cheevieModel = EmberObject.extend({
  rates: computed(() => ['low', 'normal', 'high']),
  save() {
    return resolve();
  },
});
