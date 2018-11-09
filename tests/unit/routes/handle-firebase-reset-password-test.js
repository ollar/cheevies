import { module, test } from 'qunit';
import { setupTest } from 'ember-qunit';

module('Unit | Route | handle-firebase-reset-password', function(hooks) {
  setupTest(hooks);

  test('it exists', function(assert) {
    let route = this.owner.lookup('route:handle-firebase-reset-password');
    assert.ok(route);
  });
});
