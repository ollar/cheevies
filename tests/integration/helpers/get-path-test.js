import { module, test } from 'qunit';
import { setupRenderingTest } from 'ember-qunit';
import { render } from '@ember/test-helpers';
import hbs from 'htmlbars-inline-precompile';

module('Integration | Helper | get-path', function(hooks) {
    setupRenderingTest(hooks);

    // Replace this with your real tests.
    test('it renders', async function(assert) {
        this.set('inputValue', '1234');

        await render(hbs`{{get-path inputValue}}`);

        assert.equal(this.element.textContent.trim(), '/1234');
    });

    test('makes path', async function(assert) {
        await render(hbs`{{get-path 'some-path' 'inner-dir' 'file-name.png'}}`);

        assert.equal(this.element.textContent.trim(), '/some-path/inner-dir/file-name.png');
    });
});
