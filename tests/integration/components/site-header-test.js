import { module, test } from 'qunit';
import { setupRenderingTest } from 'ember-qunit';
import { render, find, clearRender } from '@ember/test-helpers';
import hbs from 'htmlbars-inline-precompile';
import Service from '@ember/service';

const routerStub = Service.extend({
  currentRouteName: 'noname',
});

module('Integration | Component | site-header', function(hooks) {
  setupRenderingTest(hooks);

  hooks.beforeEach(function() {
    this.owner.register('service:router', routerStub);
  });

  test('it renders', async function(assert) {
    await render(hbs`{{site-header}}`);

    assert.ok(find('svg'));
  });

  test('it shows hamburger on index', async function(assert) {
    this.owner.lookup('service:router').set('currentRouteName', 'index');
    await render(hbs`{{site-header}}`);
    assert.ok(find('svg[name="menu"]'));

    await clearRender();

    this.owner.lookup('service:router').set('currentRouteName', 'index.test');
    await render(hbs`{{site-header}}`);
    assert.ok(find('svg[name="menu"]'));

    await clearRender();

    this.owner.lookup('service:router').set('currentRouteName', 'assa.index');
    await render(hbs`{{site-header}}`);
    assert.notOk(find('svg[name="menu"]'));

    await clearRender();

    this.owner.lookup('service:router').set('currentRouteName', 'assa');
    await render(hbs`{{site-header}}`);
    assert.notOk(find('svg[name="menu"]'));
  });

  test('it shows back on not index', async function(assert) {
    this.owner.lookup('service:router').set('currentRouteName', 'profile');
    await render(hbs`{{site-header}}`);
    assert.ok(find('svg[name="chevron-left"]'));

    await clearRender();

    this.owner.lookup('service:router').set('currentRouteName', 'zindex.test');
    await render(hbs`{{site-header}}`);
    assert.ok(find('svg[name="chevron-left"]'));

    await clearRender();

    this.owner.lookup('service:router').set('currentRouteName', 'assa.index');
    await render(hbs`{{site-header}}`);
    assert.ok(find('svg[name="chevron-left"]'));

    await clearRender();

    this.owner
      .lookup('service:router')
      .set('currentRouteName', 'index.profile');
    await render(hbs`{{site-header}}`);
    assert.notOk(find('svg[name="chevron-left"]'));
  });
});
