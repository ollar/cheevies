import { moduleForComponent, test } from 'ember-qunit';
import hbs from 'htmlbars-inline-precompile';

import { run } from '@ember/runloop';

moduleForComponent(
  'cheevie-in-list',
  'Integration | Component | cheevie in list',
  {
    integration: true,
  }
);

test('it renders', function(assert) {
  // Set any properties with this.set('myProperty', 'value');
  // Handle any actions with this.on('myAction', function(val) { ... });

  var cheevie;

  run(() => {
    run(() => {
      cheevie = {
        'image-set': {
          64: {
            url: 'some url',
          },
        },
      };

      this.set('cheevie', cheevie);

      // Template block usage:
      this.render(hbs`{{cheevie-in-list cheevie=cheevie}}`);
      assert.equal(this.$('.icon-image img').attr('height'), '64');
      assert.equal(this.$('.icon-image img').attr('width'), '64');
      assert.equal(this.$('.icon-image img').attr('src'), 'some url');
    });
  });
});
