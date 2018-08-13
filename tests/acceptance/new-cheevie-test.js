import { module, skip } from 'qunit';
import { visit, currentURL } from '@ember/test-helpers';
import { setupApplicationTest } from 'ember-qunit';

module('Acceptance | new cheevie', function(hooks) {
  setupApplicationTest(hooks);

  skip('visiting /new-cheevie', async function(assert) {
    await visit('/new-cheevie');

    assert.equal(currentURL(), '/new-cheevie');
  });
});
