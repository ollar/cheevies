import { module, skip } from 'qunit';
import { visit, currentURL } from '@ember/test-helpers';
import { setupApplicationTest } from 'ember-qunit';

module('Acceptance | profile', function(hooks) {
  setupApplicationTest(hooks);

  skip('visiting /profile', async function(assert) {
    await visit('/profile');

    assert.equal(currentURL(), '/profile');
  });
});
