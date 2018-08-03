import { module, test } from 'qunit';
import {
  visit,
  currentURL,
  fillIn,
  triggerEvent,
  settled,
  click,
  find,
} from '@ember/test-helpers';
import { setupApplicationTest } from 'ember-qunit';
import Service from '@ember/service';
import { resolve, hash } from 'rsvp';

import sinon from 'sinon';
import { computed } from '@ember/object';
import Route from '@ember/routing/route';

const storeStub = Service.extend({
  query(modelType, options) {
    const group = {
      id: 'myGroup',
      name: 'test',
      users: [{ id: 'me' }],
      cheevies: [],
    };

    const group2 = {
      id: 'notMyGroup',
      name: 'test',
      users: [{ id: 'not me' }],
      cheevies: [],
    };

    return resolve(options.equalTo === 'myGroup' ? [group] : [group2]);
  },
});

const meStub = Service.extend({
  fetch: sinon.stub().resolves({ id: 'me' }),
  model: computed(() => ({ id: 'me' })),
});

const indexRouteStub = Route.extend({
  model() {
    return hash({
      me: meStub,
      users: [],
      cheevies: [],
    });
  },
});

module('Acceptance | login', function(hooks) {
  setupApplicationTest(hooks);

  hooks.beforeEach(function() {
    const sessionService = this.owner.lookup('service:session');

    sinon.stub(sessionService, 'authenticate').callsFake(() => {
      sessionService.set('isAuthenticated', true);
      return resolve();
    });

    this.owner.register('service:store-test', storeStub);
    this.owner.register('service:me-test', meStub);
    this.owner.register('route:index', indexRouteStub);

    this.owner.inject('controller:login', 'store', 'service:store-test');
    this.owner.inject('controller:login', 'me', 'service:me-test');
    this.owner.inject('route:index', 'store', 'service:store-test');
  });

  test('visiting /login unsigned should stay on login', async function(assert) {
    await visit('/login');

    assert.equal(currentURL(), '/login');
  });

  test('visiting /login signed but no group should stay on login', async function(assert) {
    this.owner.lookup('service:session').set('isAuthenticated', true);

    await visit('/login');

    assert.equal(currentURL(), '/login');
  });

  test('visiting /login signed and has group should redirect to index', async function(assert) {
    this.owner.lookup('service:session').set('isAuthenticated', true);
    this.owner.lookup('service:session').set('data.group', 'true');

    await visit('/login');

    assert.equal(currentURL(), '/');
  });

  test('fill login form should show group form', async function(assert) {
    await visit('/login');

    await fillIn('#email', 'test@test.test');
    await fillIn('#password', '1111111');
    await triggerEvent('form', 'submit');

    assert.ok(find('[test-id="group-select-section"]'));
  });

  test('after setting group should login', async function(assert) {
    this.owner.lookup('service:session').set('isAuthenticated', true);

    await visit('/login');

    await fillIn('#group', 'myGroup');
    await triggerEvent('form', 'submit');

    await settled();

    assert.equal(currentURL(), '/');
  });

  test('after setting wrong group should not login', async function(assert) {
    this.owner.lookup('service:session').set('isAuthenticated', true);

    await visit('/login');

    await fillIn('#group', 'wrongGroup');
    await triggerEvent('form', 'submit');

    await settled();

    assert.equal(currentURL(), '/login');
  });

  test('test invalidate', async function(assert) {
    this.owner.lookup('service:session').set('isAuthenticated', true);

    await visit('/login');

    await click('[data-test-id="invalidate-button"]');

    await settled();

    assert.ok(
      this.owner.lookup('service:session').get('isAuthenticated'),
      false
    );
    assert.notOk(this.owner.lookup('service:session').get('data.group'));
  });
});
