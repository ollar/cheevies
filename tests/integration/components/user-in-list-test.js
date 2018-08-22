import { module, test } from 'qunit';
import { setupRenderingTest } from 'ember-qunit';
import { render } from '@ember/test-helpers';
import hbs from 'htmlbars-inline-precompile';
import { myGroupStub } from '../../acceptance/common-stubs';

const user = {
  name: 'tester user',
  cheevies: [],
};

module('Integration | Component | user-in-list', function(hooks) {
  setupRenderingTest(hooks);

  hooks.beforeEach(function() {
    this.owner.register('service:my-group', myGroupStub);
  });

  test('it renders without image', async function(assert) {
    this.set('user', user);

    await render(hbs`{{user-in-list user=user}}`);

    assert.equal(
      this.element.querySelector('.icon-image').textContent.trim(),
      'TU'
    );
  });

  test('it renders with image', async function(assert) {
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
