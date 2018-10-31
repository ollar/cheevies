import { module, test } from 'qunit';
import { setupRenderingTest } from 'ember-qunit';
import { render } from '@ember/test-helpers';
import hbs from 'htmlbars-inline-precompile';

module('Integration | Component | activity-list-item', function(hooks) {
    setupRenderingTest(hooks);

    test('it renders', async function(assert) {
        const _data = {
            created: Date.now(),
            action: 'giveCheevie',
            group: 'test',
            text: '',
        };

        this.set('_data', _data);

        await render(hbs`{{activity-list-item _data=_data class="activity-list-item"}}`);

        assert.ok(this.element.textContent.trim().match(/\d*.gave cheevie/));
    });
});
