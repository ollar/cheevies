import { module, test } from 'qunit';
import { visit, currentURL } from '@ember/test-helpers';
import { setupApplicationTest } from 'ember-qunit';
import Service from '@ember/service';
import { computed } from '@ember/object';

const sessionStub = Service.extend({
  isAuthenticated: false,
  data: computed(() => ({ authenticated: {} })),
});

module('Acceptance | login', function(hooks) {
  setupApplicationTest(hooks);

  hooks.beforeEach(function() {
    this.owner.register('service:session', sessionStub);
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
    this.owner
      .lookup('service:session')
      .set('data.authenticated.group', 'true');

    await visit('/login');

    assert.equal(currentURL(), '/');
  });
});
