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
    // waitFor,
    click,
} from '@ember/test-helpers';
import {
    setupApplicationTest
} from 'ember-qunit';

import {
    testgroup,
    uid,
} from '../../consts';
import {
    sleep
} from '../../utils';

module('Acceptance | wardrobe/select-group', function (hooks) {
    setupApplicationTest(hooks);

    hooks.beforeEach(async function () {
        let session = this.owner.lookup('service:session');
        await session.authenticate('authenticator:test', {
            uid
        });
    });

    test('visiting /wardrobe/select-group', async function (assert) {
        await visit('/wardrobe/select-group');

        assert.equal(currentURL(), '/wardrobe/select-group');
    });

    test('after setting wrong group and group does not exist - should NOT login', async function (assert) {
        await visit('/wardrobe/select-group');

        await fillIn('#group', 'wrongGroup');
        await triggerEvent('form', 'submit');

        await sleep(4000);

        assert.equal(currentURL(), '/wardrobe/select-group');
    });

    test('after setting wrong group and group is public - should add to group and login', async function (assert) {
        const myGroup = this.owner.lookup('service:my-group');
        const me = this.owner.lookup('service:me');

        await visit('/wardrobe/select-group');
        await fillIn('#group', 'testgrouppublic');
        await triggerEvent('form', 'submit');

        await sleep(3000);

        assert.equal(myGroup.groupName, 'testgrouppublic');
        assert.ok(myGroup.model.users.indexOf(me.model) > -1);
        assert.ok(me.model.groups.indexOf(myGroup.model) > -1);
        assert.equal(currentURL(), '/');

        myGroup.model.set('users', []);
        me.model.groups.removeObject(myGroup.model);
        await myGroup.model.save();
        await me.model.save();
    });

    test('after setting wrong group and group is locked - should NOT login', async function (assert) {
        await visit('/wardrobe/select-group');

        await fillIn('#group', 'testgrouplocked');
        await triggerEvent('form', 'submit');

        // await waitFor('.callout.error', {
        //     timeout: 4000,
        // });

        await sleep(4000);

        assert.equal(currentURL(), '/wardrobe/select-group');
    });

    skip('test invalidate', async function (assert) {
        await visit('/wardrobe/select-group');

        await click('[data-test-id="invalidate-button"]');

        await sleep(2000);

        assert.ok(this.owner.lookup('service:session').get('isAuthenticated'), false);
        assert.notOk(this.owner.lookup('service:session').get('data.group'));
    });

    // =============================================================================================
    // =============================================================================================
    // =============================================================================================

    test('optimistic flow', async function (assert) {
        await visit('/wardrobe/select-group');

        await fillIn('#group', testgroup);
        await triggerEvent('form', 'submit');

        await sleep(2000);

        assert.equal(currentURL(), '/');
    });
});
