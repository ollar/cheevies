import { moduleForComponent, test } from 'ember-qunit';
import hbs from 'htmlbars-inline-precompile';

moduleForComponent('modal-wrapper', 'Integration | Component | modal wrapper', {
    integration: true,
});

test('it renders', function(assert) {
    // Set any properties with this.set('myProperty', 'value');
    // Handle any actions with this.on('myAction', function(val) { ... });

    this.actions = {
        goBack: () => true,
    };

    this.render(hbs`{{modal-wrapper goBack=(action 'goBack')}}`);

    assert.equal(
        this.$()
            .text()
            .trim(),
        ''
    );

    // Template block usage:
    this.render(hbs`
    {{#modal-wrapper goBack=(action 'goBack')}}
      template block text
    {{/modal-wrapper}}
  `);

    assert.equal(
        this.$('.modal-content')
            .text()
            .trim(),
        'template block text'
    );
});
