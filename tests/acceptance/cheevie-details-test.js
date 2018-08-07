import { module, test } from 'qunit';
import { visit, currentURL } from '@ember/test-helpers';
import { setupApplicationTest } from 'ember-qunit';

module('Acceptance | cheevie details', function(hooks) {
  setupApplicationTest(hooks);

  test('visiting /cheevie-details', async function(assert) {
    await visit('/cheevie-details');

    assert.equal(currentURL(), '/cheevie-details');
  });
});
