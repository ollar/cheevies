import { module, test } from 'qunit';
import { visit, currentURL, settled } from '@ember/test-helpers';
import { setupApplicationTest } from 'ember-qunit';

// todo: move to configs
const uid = 'aOku4UacsDeWnb5qezWOuw4EKvl2';
const testGroup = 'testGroup';

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
        session.set('data.group', testGroup);

        await visit('/');

        assert.equal(currentURL(), '/');
    });
});
