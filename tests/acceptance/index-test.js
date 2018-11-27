import { module, test } from 'qunit';
import { visit, currentURL, settled } from '@ember/test-helpers';
import { setupApplicationTest } from 'ember-qunit';

import { testgroup, uid } from '../consts';

module('Acceptance | index', function(hooks) {
    setupApplicationTest(hooks);

    test('visiting / unsigned should redirect to /login', async function(assert) {
        await visit('/');

        await settled();

        assert.equal(currentURL(), '/login');
    });

    test('visiting / signed but no group should redirect to /login', async function(assert) {
        this.owner.lookup('service:session').set('isAuthenticated', true);

        await visit('/');

        assert.equal(currentURL(), '/login');
    });

    test('visiting / signed and has group should stay on index', async function(assert) {
        const session = this.owner.lookup('service:session');
        await session.authenticate('authenticator:test', { uid });
        session.set('data.group', testgroup);

        await visit('/');

        assert.equal(currentURL(), '/');
    });
});
