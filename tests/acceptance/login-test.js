import { module, test } from 'qunit';
import {
  visit,
  currentURL,
  fillIn,
  triggerEvent,
  settled,
  find,
} from '@ember/test-helpers';
import { setupApplicationTest } from 'ember-qunit';
import Service from '@ember/service';
import { resolve } from 'rsvp';

import sinon from 'sinon';
import { computed } from '@ember/object';

module('Acceptance | login', function(hooks) {
  setupApplicationTest(hooks);

  hooks.beforeEach(function() {
    const sessionService = this.owner.lookup('service:session');

    sinon.stub(sessionService, 'authenticate').callsFake(() => {
      sessionService.set('isAuthenticated', true);
      return resolve();
    });
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
    const storeStub = Service.extend({
      query: sinon
        .stub()
        .resolves([
          { id: 'myGroup', name: 'test', users: [{ id: 'me' }], cheevies: [] },
        ]),
    });
    const meStub = Service.extend({
      fetch: sinon.stub().resolves({ id: 'me' }),
      model: computed(() => ({ id: 'me' })),
    });
    this.owner.register('service:store-test', storeStub);
    this.owner.register('service:me-test', meStub);

    this.owner.inject('controller:login', 'store', 'service:store-test');
    this.owner.inject('controller:login', 'me', 'service:me-test');

    await visit('/login');

    await fillIn('#group', 'testGroup');
    await triggerEvent('form', 'submit');

    await settled();

    assert.equal(currentURL(), '/');
  });
});
