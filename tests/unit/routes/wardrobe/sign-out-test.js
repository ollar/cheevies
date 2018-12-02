import { module, test } from 'qunit';
import { setupTest } from 'ember-qunit';

module('Unit | Route | wardrobe/sing-out', function(hooks) {
  setupTest(hooks);

  test('it exists', function(assert) {
    let route = this.owner.lookup('route:wardrobe/sing-out');
    assert.ok(route);
  });
});
