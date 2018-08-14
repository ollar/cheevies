import { moduleForComponent, test } from 'ember-qunit';
import hbs from 'htmlbars-inline-precompile';

moduleForComponent('item-hint', 'Integration | Component | item hint', {
  integration: true,
});

test('it renders', function(assert) {
  // Set any properties with this.set('myProperty', 'value');
  // Handle any actions with this.on('myAction', function(val) { ... });

  const cheevie = {
    id: '1',
    name: 'test',
    description: 'description',
  };

  this.set('cheevie', cheevie);

  this.set('actions.cheevieDetails', () => false);

  this.render(hbs`{{item-hint
    data=cheevie
    id=(add cheevie.id '_hint')
    cheevieDetailsAction=(action 'cheevieDetails' cheevie)}}`);

  assert.equal(
    this.$('.title')
      .text()
      .trim(),
    cheevie.name
  );

  assert.equal(
    this.$('.content')
      .text()
      .trim(),
    cheevie.description
  );

  // Template block usage:
  this.render(hbs`
  {{#item-hint
    id=(add cheevie.id '_hint')
    cheevieDetailsAction=(action 'cheevieDetails' cheevie)}}
    template block text
    {{/item-hint}}
  `);

  assert.equal(
    this.$()
      .text()
      .trim(),
    'template block text'
  );
});
