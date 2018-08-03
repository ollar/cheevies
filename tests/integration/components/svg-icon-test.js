import { module, test } from 'qunit';
import { setupRenderingTest } from 'ember-qunit';
import { render } from '@ember/test-helpers';
import hbs from 'htmlbars-inline-precompile';

module('Integration | Component | svg-icon', function(hooks) {
  setupRenderingTest(hooks);

  test('it renders', async function(assert) {
    // Template block usage:
    await render(hbs`
      {{svg-icon _name="users" _size=24}}
    `);

    assert.equal(this.element.querySelector('svg').getAttribute('height'), 24);
    assert.equal(this.element.querySelector('svg').getAttribute('width'), 24);
  });
});
