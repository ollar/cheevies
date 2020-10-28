import { module, test } from 'qunit';
import { setupRenderingTest } from 'ember-qunit';
import { render, find } from '@ember/test-helpers';
import hbs from 'htmlbars-inline-precompile';

module('Integration | Component | item hint', function(hooks) {
  setupRenderingTest(hooks);

  test('it renders', async function(assert) {
    // Set any properties with this.set('myProperty', 'value');
    // Handle any actions with this.on('myAction', function(val) { ... });

    const cheevie = {
      id: '1',
      name: 'test',
      description: 'description',
    };

    this.set('cheevie', cheevie);

    this.set('actions.cheevieDetails', () => false);

    await render(hbs`{{item-hint
      data=cheevie
      id=(add cheevie.id '_hint')
      cheevieDetailsAction=(action 'cheevieDetails' cheevie)}}`);

    assert.equal(
      find('.title').textContent
        .trim(),
      cheevie.name
    );

    assert.equal(
      find('.content').textContent
        .trim(),
      cheevie.description
    );

    // Template block usage:
    await render(hbs`
    {{#item-hint
      id=(add cheevie.id '_hint')
      cheevieDetailsAction=(action 'cheevieDetails' cheevie)}}
      template block text
      {{/item-hint}}
    `);

    assert.equal(
      find('*').textContent
        .trim(),
      'template block text'
    );
  });
});
