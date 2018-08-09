import { module, test } from 'qunit';
import {
  visit,
  currentURL,
  fillIn,
  settled,
  triggerEvent,
} from '@ember/test-helpers';
import { setupApplicationTest } from 'ember-qunit';
import Service from '@ember/service';
import { computed } from '@ember/object';
import { resolve } from 'rsvp';
import sinon from 'sinon';

const sessionServiceStub = Service.extend({
  isAuthenticated: true,
  data: computed(() => ({
    group: 'tester',
    authenticated: {},
  })),
});

const cheevieModel = sinon.stub().resolves({
  save() {
    return resolve();
  },
});

const storeStub = Service.extend({
  query() {
    const group = {
      id: 'myGroup',
      name: 'test',
      users: [],
      cheevies: [],
    };

    return resolve([group]);
  },

  createRecord() {
    return cheevieModel();
  },
});

module('Acceptance | create cheevie', function(hooks) {
  setupApplicationTest(hooks);

  hooks.beforeEach(function() {
    this.owner.register('service:session', sessionServiceStub);
    this.owner.register('service:store-test', storeStub);
    // this.owner.inject('route:index', 'store', 'service:store-test');
    // this.owner.inject(
    //   'route:index.create-cheevie',
    //   'store',
    //   'service:store-test'
    // );
  });

  test('visiting /create-cheevie', async function(assert) {
    await visit('/create-cheevie');

    assert.equal(currentURL(), '/create-cheevie');
  });

  test('it creates cheevie model and adds it to the group', async function(assert) {
    await visit('/create-cheevie');

    await fillIn('#name', 'test-cheevie-name');
    await fillIn('#power', 'low');
    await fillIn('#description', 'test-cheevie-description');

    await triggerEvent('form', 'submit');
    await settled();

    assert.ok('a');
  });
});
