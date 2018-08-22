import Application from '../app';
import config from '../config/environment';
import { setApplication } from '@ember/test-helpers';
import { start } from 'ember-qunit';
import Service from '@ember/service';
import { resolve } from 'rsvp';
import EmberObject, { computed } from '@ember/object';

const app = Application.create(config.APP);

const storeStub = Service.extend({
  query(modelType, options) {
    const group = {
      id: 'mygroup',
      name: 'test',
      users: [{ id: 'me' }],
      cheevies: [],
    };

    const group2 = {
      id: 'notmygroup',
      name: 'test',
      users: [{ id: 'not me' }],
      cheevies: [],
    };

    return resolve({});
  },

  createRecord() {
    return EmberObject.create();
  },
});

// app.register('service:store', storeStub);

setApplication(app);
start();
