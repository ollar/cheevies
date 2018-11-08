import { module, test, skip } from 'qunit';
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

    // todo: fix this logic
    skip('after setting wrong group should not login', async function(assert) {
        this.owner.lookup('service:session').set('isAuthenticated', true);

        await visit('/login');

        await fillIn('#group', 'wrongGroup');
        await triggerEvent('form', 'submit');

        await settled();

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
