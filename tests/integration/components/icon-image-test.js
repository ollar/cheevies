import { module, test } from 'qunit';
import { setupRenderingTest } from 'ember-qunit';
import { render, find, findAll } from '@ember/test-helpers';
import hbs from 'htmlbars-inline-precompile';
import { run } from '@ember/runloop';

module('Integration | Component | icon image', function(hooks) {
  setupRenderingTest(hooks);

  test('it renders', function(assert) {
      // Set any properties with this.set('myProperty', 'value');
      // Handle any actions with this.on('myAction', function(val) { ... });

      var image;

      run(async () => {
          this.set('data', {
              name: 'test dev',
          });

          await render(hbs`{{icon-image data=data}}`);

          assert.equal(
              find('*').textContent
                  .trim(),
              'TD'
          );

          run(async () => {
              image = {
                  sm: {
                      url: 'image_url_sm',
                  },
                  md: {
                      url: 'image_url_md',
                  },
                  lg: {
                      url: 'image_url_lg',
                  },
              };
              this.set('image', image);
              this.set('data', {
                  name: 'test dev',
              });

              await render(hbs`{{icon-image image=image data=data}}`);

              assert.ok(findAll('img').length);
              assert.ok(find('.icon-image').classList.contains('has-image'));
          });
      });
  });
});
