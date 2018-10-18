import { module, test } from 'qunit';
import { setupTest } from 'ember-qunit';

module('Unit | Service | install-standalone', function(hooks) {
  setupTest(hooks);

  // Replace this with your real tests.
  test('it exists', function(assert) {
    let service = this.owner.lookup('service:install-standalone');
    assert.ok(service);
  });
});
