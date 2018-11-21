import { module, test } from 'qunit';
import { visit, currentURL, fillIn, triggerEvent, waitFor } from '@ember/test-helpers';
import { setupApplicationTest } from 'ember-qunit';

const uid = 'aOku4UacsDeWnb5qezWOuw4EKvl2';
const testGroup = 'testGroup';
const sleep = (timeout = 1000) => new Promise(res => setTimeout(() => res(), timeout));

module('Acceptance | create group', function(hooks) {
    setupApplicationTest(hooks);

    hooks.beforeEach(async function() {
        window.localStorage.clear();

        const session = this.owner.lookup('service:session');
        await session.authenticate('authenticator:test', { uid });
    });

    test('visiting /create-group', async function(assert) {
        await visit('/create-group');

        assert.equal(currentURL(), '/create-group');
    });

    test('type existing group should show error and fail', async function(assert) {
        await visit('/create-group');

        await fillIn('#name', testGroup);
        await triggerEvent('form', 'submit');

        await waitFor('.callout.error', {
            timeout: 3000,
        });

        assert.equal(currentURL(), '/create-group');
    });

    test('type new group should add user to group and transition to index', async function(assert) {
        await visit('/create-group');

        await fillIn('#name', testGroup + Math.random() * 1000);
        await triggerEvent('form', 'submit');

        await sleep(3000);

        const meService = this.owner.lookup('service:me');
        const myGroupService = this.owner.lookup('service:myGroup');

        const group = await myGroupService.fetch();

        assert.equal(currentURL(), '/');
        assert.ok(group.users.indexOf(meService.model) > -1);
        assert.ok(meService.model.groups.indexOf(group) > -1);
    });
});
