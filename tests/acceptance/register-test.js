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
import { resolve, hash } from 'rsvp';
import sinon from 'sinon';
import EmberObject from '@ember/object';
import { A } from '@ember/array';
import Route from '@ember/routing/route';
import { myGroupStub, testGroup } from './common-stubs';

const myModel = new EmberObject({ id: 'me', groups: A(), save: sinon.stub() });

const groupStub = testGroup.create();

const storeStub = Service.extend({
  query(modelType, options) {
    return resolve(options.equalTo === 'myGroup' ? A([groupStub]) : A([]));
  },
  createRecord: sinon.stub().returns(groupStub),
});

const meStub = Service.extend({
  fetch: sinon.stub().resolves(myModel),
  model: computed(() => myModel),
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
    this.owner.register('route:index', indexRouteStub);
    this.owner.register('service:my-group', myGroupStub);

    this.owner.inject('controller:register', 'store', 'service:store-test');
    this.owner.inject('controller:register', 'me', 'service:me-test');
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

  test('already signed user should see group select form', async function(assert) {
    this.owner.lookup('service:session').set('isAuthenticated', true);

    await visit('/register');

    assert.ok(find('[test-id="group-select-section"]'));
  });

  test('after register success group select form should appear', async function(assert) {
    await visit('/register');

    const controller = this.owner.lookup('controller:register');
    controller.model.signUp = sinon.stub().resolves();

    await fillIn('#name', 'tester');
    await fillIn('#email', 'test@test.test');
    await fillIn('#password', '123123123');
    await triggerEvent('form', 'submit');

    await settled();

    assert.ok(find('[test-id="group-select-section"]'));
  });

  test('after selecting group >> GROUP EXISTS >> should add user to group and redirect to index', async function(assert) {
    this.owner.lookup('service:session').set('isAuthenticated', true);
    const me = this.owner.lookup('controller:register').me;

    await visit('/register');
    await fillIn('#group', 'myGroup');
    await triggerEvent('form', 'submit');

    await settled();

    // user is saved to group
    const myGroup = me.model.groups.firstObject;
    assert.ok(myGroup.users.firstObject.id === me.model.id);

    // group is saved to user
    assert.ok(me.model.groups.map(_g => _g.id).indexOf(groupStub.id) > -1);

    assert.equal(currentURL(), '/');
  });

  test('after selecting group >> GROUP NOT EXISTS >> should add user to group and redirect to index', async function(assert) {
    this.owner.lookup('service:session').set('isAuthenticated', true);
    const me = this.owner.lookup('controller:register').me;

    await visit('/register');
    await fillIn('#group', 'notMyGroup');
    await triggerEvent('form', 'submit');

    await settled();

    const myGroup = me.model.groups.firstObject;
    assert.ok(myGroup.users.firstObject.id === me.model.id);

    assert.equal(currentURL(), '/');
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
    assert.notOk(this.owner.lookup('service:session').get('data.group'));
  });
});
