import { module, test } from 'qunit';
import { visit, currentURL } from '@ember/test-helpers';
import { setupApplicationTest } from 'ember-qunit';
import Service from '@ember/service';
import { computed } from '@ember/object';

const sessionStub = Service.extend({
  isAuthenticated: false,
  data: computed(() => ({ authenticated: {} })),
});

module('Acceptance | index', function(hooks) {
  setupApplicationTest(hooks);

  hooks.beforeEach(function() {
    this.owner.register('service:session', sessionStub);
  });

  test('visiting / unsigned should redirect to /login', async function(assert) {
    await visit('/');

    assert.equal(currentURL(), '/login');
  });

  test('visiting / signed but no group should redirect to /login', async function(assert) {
    this.owner.lookup('service:session').set('isAuthenticated', true);

    await visit('/');

    assert.equal(currentURL(), '/login');
  });

  test('visiting / signed and has group should stay on index', async function(assert) {
    this.owner.lookup('service:session').set('isAuthenticated', true);
    this.owner.lookup('service:session').set('data.group', 'true');

    await visit('/');

    assert.equal(currentURL(), '/');
  });
});
