import EmberObject from '@ember/object';
import UnauthenticatedRouteMixinMixin from 'cheevies-jerk/mixins/unauthenticated-route-mixin';
import { module, test } from 'qunit';

module('Unit | Mixin | unauthenticated-route-mixin', function() {
  // Replace this with your real tests.
  test('it works', function (assert) {
    let UnauthenticatedRouteMixinObject = EmberObject.extend(UnauthenticatedRouteMixinMixin);
    let subject = UnauthenticatedRouteMixinObject.create();
    assert.ok(subject);
  });
});
