import { module, test } from 'qunit';
import { setupTest } from 'ember-qunit';

module('Unit | Route | join-group', function(hooks) {
  setupTest(hooks);

  test('it exists', function(assert) {
    let route = this.owner.lookup('route:join-group');
    assert.ok(route);
  });
});
