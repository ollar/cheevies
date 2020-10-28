import { module, test } from 'qunit';
import { setupTest } from 'ember-qunit';

module('Unit | Route | index/cheevie details', function(hooks) {
  setupTest(hooks);

  test('it exists', function(assert) {
    let route = this.owner.lookup('route:index/cheevie-details');
    assert.ok(route);
  });
});
