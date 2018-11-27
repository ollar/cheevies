import { module, test, skip } from 'qunit';
import {
    visit,
    currentURL,
    fillIn,
    triggerEvent,
    settled,
    click,
    find,
    waitFor,
} from '@ember/test-helpers';
import { setupApplicationTest } from 'ember-qunit';

import { testgroup, uid, email, password } from '../consts';
import { sleep } from '../utils';

module('Acceptance | register', function(hooks) {
    setupApplicationTest(hooks);

    hooks.beforeEach(function() {
        window.localStorage.clear();
    });

    test('visiting /register unsigned should stay on register', async function(assert) {
        await visit('/register');

        assert.equal(currentURL(), '/register');
    });

    test('visiting /register signed but no group should stay on register', async function(assert) {
        this.owner.lookup('service:session').set('isAuthenticated', true);

        await visit('/register');

        assert.equal(currentURL(), '/register');
    });

    test('visiting /register signed and has group should redirect to index', async function(assert) {
        const session = this.owner.lookup('service:session');
        await session.authenticate('authenticator:test', { uid });
        session.set('data.group', testgroup);

        await visit('/register');

        assert.equal(currentURL(), '/');
    });

    test('already signed user should see group select form', async function(assert) {
        this.owner.lookup('service:session').set('isAuthenticated', true);

        await visit('/register');

        assert.ok(find('[test-id="group-select-section"]'));
    });

    skip('after register success group select form should appear', async function(assert) {
        await visit('/register');

        await fillIn('#name', 'tester');
        await fillIn('#email', `test@test${Math.random() * 1000}.test`);
        await fillIn('#password', '123123123');
        await triggerEvent('form', 'submit');

        await sleep(4000);

        assert.ok(find('[test-id="group-select-section"]'));
    });

    // =========================================================================
    // ============================================================ GROUP EXISTS

    test('after selecting group >> GROUP EXISTS >> GROUP IS PUBLIC >> should add user to group and redirect to index', async function(assert) {
        const me = this.owner.lookup('service:me');

        const session = this.owner.lookup('service:session');
        await session.authenticate('authenticator:test', { uid });

        await visit('/register');
        await fillIn('#group', 'testgrouppublic');
        await triggerEvent('form', 'submit');

        await sleep(3000);

        // user is saved to group
        const myGroups = me.model.groups;
        const myGroup = myGroups.find(g => g.name === 'testgrouppublic');
        assert.ok(myGroup.users.firstObject.id === me.model.id);

        // group is saved to user
        assert.ok(me.model.groups.map(_g => _g.id).indexOf(myGroup.id) > -1);

        assert.equal(currentURL(), '/');

        myGroup.set('users', []);
        me.model.groups.removeObject(myGroup.model);
        await myGroup.save();
        await me.model.save();
    });

    test('after selecting group >> GROUP EXISTS >> GROUP IS PRIVATE >> should show error message and fail', async function(assert) {
        const session = this.owner.lookup('service:session');
        await session.authenticate('authenticator:test', { uid });

        await visit('/register');
        await fillIn('#group', 'testgrouplocked');
        await triggerEvent('form', 'submit');

        // await waitFor('.callout.error', {
        //     timeout: 4000,
        // });

        await sleep(4000);

        assert.equal(currentURL(), '/register');
    });

    // =========================================================================

    test('after selecting group >> GROUP NOT EXISTS >> should show error message and fail', async function(assert) {
        const session = this.owner.lookup('service:session');
        await session.authenticate('authenticator:test', { uid });

        const _group = testgroup + Math.random() * 1000;

        await visit('/register');
        await fillIn('#group', _group);
        await triggerEvent('form', 'submit');

        // await waitFor('.callout.error', {
        //     timeout: 4000,
        // });

        await sleep(4000);

        assert.equal(currentURL(), '/register');
    });

    test('test invalidate', async function(assert) {
        this.owner.lookup('service:session').set('isAuthenticated', true);

        await visit('/register');
        await click('[test-id="invalidate-button"]');
        await settled();

        assert.ok(this.owner.lookup('service:session').get('isAuthenticated'), false);
        assert.notOk(this.owner.lookup('service:session').get('data.group'));
    });

    // =========================================================================
    // ============================================================== Flow tests

    test('optimistic register flow', async function(assert) {
        await visit('/register');

        await fillIn('#name', 'tester');
        await fillIn('#email', email + Math.floor(Math.random() * 1000));
        await fillIn('#password', password);
        await triggerEvent('form', 'submit');

        await waitFor('[test-id="group-select-section"]', { timeout: 4000 });

        await fillIn('#group', testgroup);
        await triggerEvent('form', 'submit');

        await sleep(2000);

        assert.equal(currentURL(), '/');
    });
});
