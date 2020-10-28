import { module, test } from 'qunit';
import { setupRenderingTest } from 'ember-qunit';
import { render, find } from '@ember/test-helpers';
import hbs from 'htmlbars-inline-precompile';

module('helper:add', function(hooks) {
  setupRenderingTest(hooks);

  test('it adds 2 numbers', async function(assert) {
    await render(hbs`{{add 1 2}}`);

    assert.equal(
      find('*').textContent
        .trim(),
      '3'
    );
  });

  test('it adds 3 numbers', async function(assert) {
    await render(hbs`{{add 1 2 3}}`);

    assert.equal(
      find('*').textContent
        .trim(),
      '6'
    );
  });

  test('it adds strings', async function(assert) {
    await render(hbs`{{add '1' '2'}}`);

    assert.equal(
      find('*').textContent
        .trim(),
      '12'
    );
  });

  test('it adds strings and numbers', async function(assert) {
    await render(hbs`{{add '1' '2' 3}}`);

    assert.equal(
      find('*').textContent
        .trim(),
      '123'
    );
  });
});
