import { module, test } from 'qunit';
import { setupRenderingTest } from 'ember-qunit';
import { render, clearRender } from '@ember/test-helpers';
import hbs from 'htmlbars-inline-precompile';

import Service from '@ember/service';
import { computed } from '@ember/object';

const meStub = Service.extend({
  model: computed(() => ({
    name: 'tester',
  })),
});

const sessionStub = Service.extend({
  isAuthenticated: true,
});

module('Integration | Component | site-header', function(hooks) {
  setupRenderingTest(hooks);

  test('it renders', async function(assert) {
    this.owner.register('service:me', meStub);
    this.owner.register('service:session', sessionStub);

    await render(hbs`{{site-header}}`);

    const myName = this.owner.lookup('service:me').get('model.name');

    assert.equal(
      this.element.querySelector('.user-name').textContent.trim(),
      myName
    );

    assert.ok(this.element.querySelector('.level-right button'));

    await clearRender();

    this.owner.lookup('service:session').set('isAuthenticated', false);

    await render(hbs`{{site-header}}`);

    assert.notOk(this.element.querySelector('.level-right button'));
  });
});
