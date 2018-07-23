import { module, test } from 'qunit';
import { visit, currentURL } from '@ember/test-helpers';
import { setupApplicationTest } from 'ember-qunit';
import Service from '@ember/service';
import { computed } from '@ember/object';

const sessionStub = Service.extend({
  isAuthenticated: false,
  data: computed(() => ({ authenticated: {} })),
});

module('Acceptance | register', function(hooks) {
  setupApplicationTest(hooks);

  hooks.beforeEach(function() {
    this.owner.register('service:session', sessionStub);
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
    this.owner
      .lookup('service:session')
      .set('data.authenticated.group', 'true');

    await visit('/register');

    assert.equal(currentURL(), '/');
  });
});
