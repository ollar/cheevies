import { module, test } from 'qunit';
import { visit, currentURL, settled } from '@ember/test-helpers';
import { setupApplicationTest } from 'ember-qunit';

import { testgroup, uid } from '../consts';

module('Acceptance | index', function(hooks) {
    setupApplicationTest(hooks);

    test('visiting / unsigned should redirect to /login', async function(assert) {
        await visit('/');

        await settled();

        assert.equal(currentURL(), '/wardrobe/social-sign-in');
    });

    test('visiting / signed but no group should redirect to /select-group', async function(assert) {
        const session = this.owner.lookup('service:session');
        await session.authenticate('authenticator:test', { uid });

        await visit('/');

        assert.equal(currentURL(), '/wardrobe/select-group');
    });

    test('visiting / signed and has group should stay on index', async function(assert) {
        const session = this.owner.lookup('service:session');
        await session.authenticate('authenticator:test', { uid });
        session.set('data.group', testgroup);

        await visit('/');

        assert.equal(currentURL(), '/');
    });
});
