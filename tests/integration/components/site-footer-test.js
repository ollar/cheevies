import { moduleForComponent, test } from 'ember-qunit';
import hbs from 'htmlbars-inline-precompile';

moduleForComponent('site-footer', 'Integration | Component | site footer', {
  integration: true,
});

test('it renders', function(assert) {
  // Set any properties with this.set('myProperty', 'value');
  // Handle any actions with this.on('myAction', function(val) { ... });

  this.set('footerMessage', hbs`{{t 'footer_message'}}`);

  this.render(hbs`{{site-footer}}`);

  assert.equal(
    this.$()
      .text()
      .trim(),
    this.get('footerMessage')
  );

  // Template block usage:
  this.render(hbs`
    {{#site-footer}}
      template block text
    {{/site-footer}}
  `);

  assert.equal(
    this.$()
      .text()
      .trim(),
    'template block text'
  );
});
