import { module, test } from 'qunit';
import { setupRenderingTest } from 'ember-qunit';
import { render } from '@ember/test-helpers';
import hbs from 'htmlbars-inline-precompile';

const user = {
  name: 'tester user',
};

module('Integration | Component | user-in-list', function(hooks) {
  setupRenderingTest(hooks);

  test('it renders', async function(assert) {
    this.set('user', user);

    await render(hbs`{{user-in-list user=user}}`);

    assert.equal(
      this.element.querySelector('.name').textContent.trim(),
      user.name
    );

    assert.equal(
      this.element.querySelector('.icon-image').textContent.trim(),
      'TU'
    );
  });

  test('it renders', async function(assert) {
    user['image-set'] = {
      128: {
        url: 'image_url',
      },
    };
    this.set('user', user);

    await render(hbs`{{user-in-list user=user}}`);

    assert.ok(this.element.querySelector('.icon-image img'));
    assert.equal(
      this.element.querySelector('.icon-image img').getAttribute('src'),
      'image_url'
    );

    assert.equal(
      this.element.querySelector('.icon-image img').getAttribute('height'),
      128
    );

    assert.equal(
      this.element.querySelector('.icon-image img').getAttribute('width'),
      128
    );
  });
});
