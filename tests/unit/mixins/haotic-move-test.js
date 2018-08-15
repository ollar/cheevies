import EmberObject from '@ember/object';
import HaoticMoveMixin from 'cheevies-jerk/mixins/haotic-move';
import { module, test } from 'qunit';

module('Unit | Mixin | haotic-move', function() {
  // Replace this with your real tests.
  test('it works', function (assert) {
    let HaoticMoveObject = EmberObject.extend(HaoticMoveMixin);
    let subject = HaoticMoveObject.create();
    assert.ok(subject);
  });
});
