import { module, test, skip } from 'qunit';
import {
    visit,
    currentURL,
    fillIn,
    triggerEvent,
    // waitFor
} from '@ember/test-helpers';
import { setupApplicationTest } from 'ember-qunit';

import { testgroup, uid, email, password } from '../../consts';
import { sleep } from '../../utils';

module('Acceptance | wardrobe/sign-in', function(hooks) {
    setupApplicationTest(hooks);

    hooks.beforeEach(function() {
        window.localStorage.clear();
    });

    test('visiting /wardrobe/sign-in', async function(assert) {
        await visit('/wardrobe/sign-in');

        assert.equal(currentURL(), '/wardrobe/sign-in');
    });

    test('visiting /wardrobe/sign-in signed but no group should redirect to /wardrobe/select-group', async function(assert) {
        const session = this.owner.lookup('service:session');
        await session.authenticate('authenticator:test', { uid });

        await visit('/wardrobe/sign-in');

        assert.equal(currentURL(), '/wardrobe/select-group');
    });

    skip('visiting /wardrobe/sign-in signed and has group should redirect to index', async function(assert) {
        const session = this.owner.lookup('service:session');
        await session.authenticate('authenticator:test', { uid });
        session.set('data.group', testgroup);

        await visit('/wardrobe/sign-in');
        assert.equal(currentURL(), '/');
    });

    // =============================================================================================
    // =============================================================================================
    // =============================================================================================

    test('optimistic login flow', async function(assert) {
        await visit('/wardrobe/sign-in');

        await fillIn('#email', email);
        await fillIn('#password', password);
        await triggerEvent('form', 'submit');

        await sleep(2000);

        assert.equal(currentURL(), '/wardrobe/select-group');
    });
});
