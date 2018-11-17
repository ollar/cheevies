import { module, test } from 'qunit';
import { setupRenderingTest } from 'ember-qunit';
import { render } from '@ember/test-helpers';
import hbs from 'htmlbars-inline-precompile';
import Service from '@ember/service';
import { computed } from '@ember/object';

const cheevie = {
    name: 'test cheevie',
    'image-set': {
        64: {
            url: 'image_url_64',
        },
        128: {
            url: 'image_url_128',
        },
        256: {
            url: 'image_url_256',
        },
        512: {
            url: 'image_url_512',
        },
    },
};

const me = Service.extend({
    model: computed(() => ({
        cheevies: [],
    })),
});

module('Integration | Component | cheevie in list', function(hooks) {
    setupRenderingTest(hooks);

    hooks.beforeEach(function() {
        this.owner.register('service:me', me);
    }),
        test('it renders without image', async function(assert) {
            const _cheevie = Object.assign({}, { name: 'test cheevie' });
            this.set('cheevie', _cheevie);

            await render(hbs`{{cheevie-in-list cheevie=cheevie}}`);

            assert.equal(this.element.querySelector('.icon-image').textContent.trim(), 'TC');
        });

    test('it renders with image', async function(assert) {
        this.set('cheevie', cheevie);

        await render(hbs`{{cheevie-in-list cheevie=cheevie}}`);

        assert.ok(this.element.querySelector('.icon-image picture'));
        assert.equal(this.element.querySelectorAll('.icon-image source').length, 3);

        assert.equal(
            this.element.querySelectorAll('.icon-image source')[0].getAttribute('srcset'),
            'image_url_64'
        );

        assert.equal(
            this.element.querySelectorAll('.icon-image source')[1].getAttribute('srcset'),
            'image_url_128'
        );

        assert.equal(
            this.element.querySelectorAll('.icon-image source')[2].getAttribute('srcset'),
            'image_url_256'
        );
    });
});
