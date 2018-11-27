import { module, test } from 'qunit';
import { setupRenderingTest } from 'ember-qunit';
import { render } from '@ember/test-helpers';
import hbs from 'htmlbars-inline-precompile';

const user = {
    name: 'tester user',
    cheevies: [],
};

// todo: move to configs
import { testgroup, uid } from '../../consts';

module('Integration | Component | user-in-list', function(hooks) {
    setupRenderingTest(hooks);

    hooks.beforeEach(async function() {
        const session = this.owner.lookup('service:session');
        await session.authenticate('authenticator:test', { uid });
        session.set('data.group', testgroup);
    });

    test('it renders without image', async function(assert) {
        this.set('user', user);

        await render(hbs`{{user-in-list user=user}}`);

        assert.equal(this.element.querySelector('.icon-image').textContent.trim(), 'TU');
    });

    test('it renders with image', async function(assert) {
        user['image-set'] = {
            128: {
                url: 'image_url_128',
            },
            256: {
                url: 'image_url_256',
            },
            512: {
                url: 'image_url_512',
            },
        };
        this.set('user', user);

        await render(hbs`{{user-in-list user=user}}`);

        assert.ok(this.element.querySelector('.icon-image picture'));
        assert.equal(this.element.querySelectorAll('.icon-image source').length, 3);

        assert.ok(this.element.querySelectorAll('.icon-image source')[0].getAttribute('srcset'));

        assert.ok(this.element.querySelectorAll('.icon-image source')[1].getAttribute('srcset'));

        assert.ok(this.element.querySelectorAll('.icon-image source')[2].getAttribute('srcset'));
    });
});
