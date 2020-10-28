import { module, test } from 'qunit';
import { setupRenderingTest } from 'ember-qunit';
import { render, find } from '@ember/test-helpers';
import hbs from 'htmlbars-inline-precompile';

module('helper:eq', function(hooks) {
  setupRenderingTest(hooks);

  test('two values equals', async function(assert) {
    await render(hbs`{{eq '1' '1'}}`);

    assert.equal(
      find('*').textContent
        .trim(),
      'true'
    );
  });

  test('three values equals', async function(assert) {
    await render(hbs`{{eq '1' '1' '1'}}`);

    assert.equal(
      find('*').textContent
        .trim(),
      'true'
    );
  });

  // TODO: some bug
  // test('three values equals', function(assert) {
  //   this.render(hbs`{{eq undefined undefined}}`);

  //   assert.equal(
  //     this.$()
  //       .text()
  //       .trim(),
  //     'true'
  //   );
  // });

  test('two diff values not equals', async function(assert) {
    await render(hbs`{{eq '1' '2'}}`);

    assert.equal(
      find('*').textContent
        .trim(),
      'false'
    );
  });

  test('three diff values not equals', async function(assert) {
    await render(hbs`{{eq '1' '2' '1'}}`);

    assert.equal(
      find('*').textContent
        .trim(),
      'false'
    );
  });
});
