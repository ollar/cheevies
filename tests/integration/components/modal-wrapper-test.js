import { module, test } from 'qunit';
import { setupRenderingTest } from 'ember-qunit';
import { render, find } from '@ember/test-helpers';
import hbs from 'htmlbars-inline-precompile';

module('Integration | Component | modal wrapper', function(hooks) {
  setupRenderingTest(hooks);

  test('it renders', async function(assert) {
      // Set any properties with this.set('myProperty', 'value');
      // Handle any actions with this.on('myAction', function(val) { ... });

      this.actions = {
          goBack: () => true,
      };

      // Template block usage:
      await render(hbs`
      {{#modal-wrapper goBack=(action 'goBack')}}
        template block text
      {{/modal-wrapper}}
    `);

      assert.equal(
          find('.modal-content').textContent
              .trim(),
          'template block text'
      );
  });
});
