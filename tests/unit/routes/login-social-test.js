import { module, test } from 'qunit';
import { setupTest } from 'ember-qunit';

module('Unit | Route | login-social', function(hooks) {
  setupTest(hooks);

  test('it exists', function(assert) {
    let route = this.owner.lookup('route:login-social');
    assert.ok(route);
  });
});
