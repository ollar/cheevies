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
import { computed } from '@ember/object';
import { resolve } from 'rsvp';
import sinon from 'sinon';

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

module('Acceptance | register', function(hooks) {
  setupApplicationTest(hooks);

  hooks.beforeEach(function() {
    const sessionService = this.owner.lookup('service:session');

    sinon.stub(sessionService, 'authenticate').callsFake(() => {
      sessionService.set('isAuthenticated', true);
      return resolve();
    });

    this.owner.register('service:store-test', storeStub);
    this.owner.register('service:me-test', meStub);

    this.owner.inject('controller:login', 'store', 'service:store-test');
    this.owner.inject('controller:login', 'me', 'service:me-test');
    this.owner.inject('route:index', 'store', 'service:store-test');
  });

  test('visiting /register unsigned should stay on register', async function(assert) {
    await visit('/register');

    assert.equal(currentURL(), '/register');
  });

  test('visiting /register signed but no group should stay on register', async function(assert) {
    this.owner.lookup('service:session').set('isAuthenticated', true);

    await visit('/register');

    assert.equal(currentURL(), '/register');
  });

  test('visiting /register signed and has group should redirect to index', async function(assert) {
    this.owner.lookup('service:session').set('isAuthenticated', true);
    this.owner.lookup('service:session').set('data.group', 'true');

    await visit('/register');

    assert.equal(currentURL(), '/');
  });

  test('already signed should see group select form', async function(assert) {
    this.owner.lookup('service:session').set('isAuthenticated', true);

    await visit('/register');

    assert.ok(find('[test-id="group-select-section"]'));
  });

  test('after register success group select form should appear', async function(assert) {
    await visit('/register');

    await fillIn('#email', 'test@test.test');
    await fillIn('#password', '123123123');
    await triggerEvent('form', 'submit');

    await settled();

    assert.ok(find('[test-id="group-select-section"]'));
  });

  test('test invalidate', async function(assert) {
    this.owner.lookup('service:session').set('isAuthenticated', true);

    await visit('/register');

    await click('[test-id="invalidate-button"]');

    await settled();

    assert.ok(
      this.owner.lookup('service:session').get('isAuthenticated'),
      false
    );
  });
});
