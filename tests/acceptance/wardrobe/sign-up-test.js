import {
    module,
    test,
    skip
} from 'qunit';
import {
    visit,
    currentURL,
    fillIn,
    triggerEvent,
} from '@ember/test-helpers';
import {
    setupApplicationTest
} from 'ember-qunit';

import {
    testgroup,
    uid,
    email,
    password
} from '../../consts';
import {
    sleep
} from '../../utils';

module('Acceptance | wardrobe/sign-up', function (hooks) {
    setupApplicationTest(hooks);

    test('visiting /wardrobe/sign-up', async function (assert) {
        await visit('/wardrobe/sign-up');

        assert.equal(currentURL(), '/wardrobe/sign-up');
    });

    test('visiting /wardrobe/sign-up signed but no group should redirect to select-group', async function (assert) {
        this.owner.lookup('service:session').set('isAuthenticated', true);

        await visit('/wardrobe/sign-up');

        assert.equal(currentURL(), '/wardrobe/select-group');
    });

    skip('visiting /wardrobe/sign-up signed and has group should redirect to index', async function (assert) {
        const session = this.owner.lookup('service:session');
        await session.authenticate('authenticator:test', {
            uid
        });
        session.set('data.group', testgroup);

        await visit('/wardrobe/sign-up');

        assert.equal(currentURL(), '/');
    });

    // =============================================================================================
    // ======================================================================= optimistic flow tests

    test('optimistic register flow', async function (assert) {
        await visit('/wardrobe/sign-up');

        await fillIn('#name', 'tester');
        await fillIn('#email', email + Math.floor(Math.random() * 1000));
        await fillIn('#password', password);
        await triggerEvent('form', 'submit');

        await sleep(2000);

        assert.equal(currentURL(), '/wardrobe/select-group');
    });
});
