import { module, test, skip } from 'qunit';
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
import { testGroup, cheevieModel } from './common-stubs';

const sessionServiceStub = Service.extend({
  isAuthenticated: true,
  data: computed(() => ({
    group: 'tester',
    authenticated: {},
  })),
});

const myGroupStub = Service.extend({
  groupName: 'test',
  model: testGroup,
  fetch() {
    return resolve(testGroup);
  },
});

const storeStub = Service.extend({
  query() {
    return resolve([testGroup]);
  },

  createRecord() {
    return cheevieModel;
  },
});

module('Acceptance | create cheevie', function(hooks) {
  setupApplicationTest(hooks);

  hooks.beforeEach(function() {
    this.owner.register('service:session', sessionServiceStub);
    this.owner.register('service:myGroup', myGroupStub);
    this.owner.register('service:store-test', storeStub);
    this.owner.inject('route:index', 'store', 'service:store-test');
    this.owner.inject(
      'route:index.create-cheevie',
      'store',
      'service:store-test'
    );
  });

  test('visiting /create-cheevie', async function(assert) {
    await visit('/create-cheevie');

    assert.equal(currentURL(), '/create-cheevie');
  });

  test('it creates cheevie model and adds it to the group', async function(assert) {
    await visit('/create-cheevie');

    await fillIn('#name', 'test-cheevie-name');
    await fillIn('#power', 'high');
    await fillIn('#description', 'test-cheevie-description');

    await triggerEvent('form', 'submit');
    await settled();

    assert.equal(cheevieModel.get('name'), 'test-cheevie-name');
    assert.equal(cheevieModel.power, 'high');
    assert.equal(cheevieModel.get('description'), 'test-cheevie-description');

    assert.ok(testGroup.cheevies.length === 1);
  });
});
