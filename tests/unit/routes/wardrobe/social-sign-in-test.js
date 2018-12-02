import { module, test } from 'qunit';
import { setupTest } from 'ember-qunit';

module('Unit | Route | wardrobe/social-sing-in', function(hooks) {
  setupTest(hooks);

  test('it exists', function(assert) {
    let route = this.owner.lookup('route:wardrobe/social-sing-in');
    assert.ok(route);
  });
});
