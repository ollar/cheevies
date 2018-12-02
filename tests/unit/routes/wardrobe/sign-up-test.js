import { module, test } from 'qunit';
import { setupTest } from 'ember-qunit';

module('Unit | Route | wardrobe/sing-up', function(hooks) {
  setupTest(hooks);

  test('it exists', function(assert) {
    let route = this.owner.lookup('route:wardrobe/sing-up');
    assert.ok(route);
  });
});
