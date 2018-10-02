import EmberObject from '@ember/object';
import BusyLoaderMixin from 'cheevies-jerk/mixins/busy-loader';
import { module, test } from 'qunit';

module('Unit | Mixin | busy-loader', function() {
  // Replace this with your real tests.
  test('it works', function (assert) {
    let BusyLoaderObject = EmberObject.extend(BusyLoaderMixin);
    let subject = BusyLoaderObject.create();
    assert.ok(subject);
  });
});
