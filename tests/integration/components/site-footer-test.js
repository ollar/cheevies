import { module, test } from 'qunit';
import { setupRenderingTest } from 'ember-qunit';
import { render, clearRender } from '@ember/test-helpers';
import hbs from 'htmlbars-inline-precompile';

module('Integration | Component | site-footer', function(hooks) {
  setupRenderingTest(hooks);

  test('it renders in rus', async function(assert) {
    this.owner.lookup('service:i18n').set('locale', 'ru');

    await render(hbs`{{t 'footer_message'}}`);
    const footer_message = this.element.textContent;
    await clearRender();

    await render(hbs`{{site-footer}}`);
    assert.equal(this.element.textContent.trim(), footer_message);
  });

  test('it renders in eng', async function(assert) {
    this.owner.lookup('service:i18n').set('locale', 'en');

    await render(hbs`{{t 'footer_message'}}`);
    const footer_message = this.element.textContent;
    await clearRender();

    await render(hbs`{{site-footer}}`);
    assert.equal(this.element.textContent.trim(), footer_message);
  });

  test('it renders with inner', async function(assert) {
    this.owner.lookup('service:i18n').set('locale', 'ru');

    await render(hbs`{{t 'footer_message'}}`);
    const footer_message = this.element.textContent;
    await clearRender();

    await render(hbs`{{#site-footer}}test message{{/site-footer}}`);
    assert.equal(
      this.element.textContent.trim(),
      `test message\n${footer_message}`
    );
  });
});
