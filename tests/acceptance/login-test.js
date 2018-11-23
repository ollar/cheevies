import { module, test } from 'qunit';
import {
    visit,
    currentURL,
    fillIn,
    triggerEvent,
    settled,
    waitFor,
    click,
    find,
} from '@ember/test-helpers';
import { setupApplicationTest } from 'ember-qunit';

// todo: move to configs
const email = 'tester@test.com';
const password = '123123123';
const uid = 'aOku4UacsDeWnb5qezWOuw4EKvl2';

const sleep = (timeout = 1000) => new Promise(res => setTimeout(() => res(), timeout));

module('Acceptance | login', function(hooks) {
    setupApplicationTest(hooks);

    hooks.beforeEach(function() {
        window.localStorage.clear();
    });

    test('visiting /login unsigned should stay on login', async function(assert) {
        await visit('/login');

        assert.equal(currentURL(), '/login');
    });

    test('visiting /login signed but no group should stay on login', async function(assert) {
        this.owner.lookup('service:session').set('isAuthenticated', true);

        await visit('/login');

        assert.equal(currentURL(), '/login');
    });

    test('visiting /login signed and has group should redirect to index', async function(assert) {
        let session = this.owner.lookup('service:session');
        await session.authenticate('authenticator:test', { uid });
        session.set('data.group', 'testGroup');

        await visit('/login');
        assert.equal(currentURL(), '/');
    });

    test('fill login form should show group form', async function(assert) {
        await visit('/login');

        await fillIn('#email', email);
        await fillIn('#password', password);
        await triggerEvent('form', 'submit');
        await waitFor('[test-id="group-select-section"]');

        assert.ok(find('[test-id="group-select-section"]'));
    });

    test('after setting group should login', async function(assert) {
        let session = this.owner.lookup('service:session');
        await session.authenticate('authenticator:test', { uid });

        await visit('/login');

        await fillIn('#group', 'testGroup');
        await triggerEvent('form', 'submit');

        await sleep(2000);

        assert.equal(currentURL(), '/');
    });

    test('after setting wrong group and group does not exist - should NOT login', async function(assert) {
        let session = this.owner.lookup('service:session');
        await session.authenticate('authenticator:test', { uid });

        await visit('/login');

        await fillIn('#group', 'wrongGroup');
        await triggerEvent('form', 'submit');

        await waitFor('.callout.error', {
            timeout: 4000,
        });

        assert.equal(currentURL(), '/login');
    });

    test('after setting wrong group and group is public - should add to group and login', async function(assert) {
        const myGroup = this.owner.lookup('service:my-group');
        const me = this.owner.lookup('service:me');

        let session = this.owner.lookup('service:session');
        await session.authenticate('authenticator:test', { uid });

        await visit('/login');
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

    test('after setting wrong group and group is locked - should NOT login', async function(assert) {
        let session = this.owner.lookup('service:session');
        await session.authenticate('authenticator:test', { uid });

        await visit('/login');

        await fillIn('#group', 'testgrouplocked');
        await triggerEvent('form', 'submit');

        // await waitFor('.callout.error', {
        //     timeout: 4000,
        // });

        await sleep(4000);

        assert.equal(currentURL(), '/login');
    });

    test('test invalidate', async function(assert) {
        this.owner.lookup('service:session').set('isAuthenticated', true);

        await visit('/login');

        await click('[data-test-id="invalidate-button"]');

        await settled();

        assert.ok(this.owner.lookup('service:session').get('isAuthenticated'), false);
        assert.notOk(this.owner.lookup('service:session').get('data.group'));
    });
});
