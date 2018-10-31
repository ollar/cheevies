import { module, test } from 'qunit';
import { setupRenderingTest } from 'ember-qunit';
import { render } from '@ember/test-helpers';
import hbs from 'htmlbars-inline-precompile';

import { Promise } from 'rsvp';

module('Integration | Component | profile-animation-wrapper', function(hooks) {
    setupRenderingTest(hooks);

    test('it renders', async function(assert) {
        // Set any properties with this.set('myProperty', 'value');
        // Handle any actions with this.set('myAction', function(val) { ... });

        const _cheeviesPromise = new Promise(res => res());

        this.set('_cheeviesPromise', _cheeviesPromise);

        await render(hbs`{{profile-animation-wrapper _cheeviesPromise=_cheeviesPromise}}`);

        assert.equal(this.element.textContent.trim(), '');

        // Template block usage:
        await render(hbs`
            {{#profile-animation-wrapper _cheeviesPromise=_cheeviesPromise}}
                template block text
            {{/profile-animation-wrapper}}
        `);

        assert.equal(this.element.textContent.trim(), 'template block text');
    });
});
