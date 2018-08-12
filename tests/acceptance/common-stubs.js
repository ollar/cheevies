import EmberObject, { computed } from '@ember/object';
import { resolve } from 'rsvp';

export const testGroup = EmberObject.create({
  id: 'myGroup',
  name: 'test',
  users: [],
  cheevies: [],
});

export const cheevieModel = EmberObject.create({
  save() {
    return resolve();
  },
});
