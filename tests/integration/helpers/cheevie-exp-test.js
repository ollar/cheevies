import { module, test } from 'qunit';
import { setupRenderingTest } from 'ember-qunit';
import { render } from '@ember/test-helpers';
import hbs from 'htmlbars-inline-precompile';
import EmberObject from '@ember/object';

const cheevie = EmberObject.extend();

module('Integration | Helper | cheevie-exp', function(hooks) {
  setupRenderingTest(hooks);

  // Replace this with your real tests.
  test('no cheevies -> zero exp', async function(assert) {
    this.set('inputValue', []);

    await render(hbs`{{cheevie-exp inputValue}}`);

    assert.equal(this.element.textContent.trim(), 0);
  });

  test('3 low cheevies -> 30 exp', async function(assert) {
    this.set('inputValue', [
      cheevie.create({ power: 'low' }),
      cheevie.create({ power: 'low' }),
      cheevie.create({ power: 'low' }),
    ]);

    await render(hbs`{{cheevie-exp inputValue}}`);

    assert.equal(this.element.textContent.trim(), 30);
  });

  test('3 normal cheevies -> 60 exp', async function(assert) {
    this.set('inputValue', [
      cheevie.create({ power: 'normal' }),
      cheevie.create({ power: 'normal' }),
      cheevie.create({ power: 'normal' }),
    ]);

    await render(hbs`{{cheevie-exp inputValue}}`);

    assert.equal(this.element.textContent.trim(), 60);
  });

  test('3 high cheevies -> 90 exp', async function(assert) {
    this.set('inputValue', [
      cheevie.create({ power: 'high' }),
      cheevie.create({ power: 'high' }),
      cheevie.create({ power: 'high' }),
    ]);

    await render(hbs`{{cheevie-exp inputValue}}`);

    assert.equal(this.element.textContent.trim(), 90);
  });
});
