import { module, test } from 'qunit';
import { visit, currentURL, fillIn, click, triggerEvent } from '@ember/test-helpers';
import { setupApplicationTest } from 'ember-qunit';

const uid = 'aOku4UacsDeWnb5qezWOuw4EKvl2';
const testGroup = 'testGroup';
const sleep = (timeout = 1000) => new Promise(res => setTimeout(() => res(), timeout));

module('Acceptance | create cheevie', function(hooks) {
    setupApplicationTest(hooks);

    hooks.beforeEach(async function() {
        window.localStorage.clear();

        const session = this.owner.lookup('service:session');
        await session.authenticate('authenticator:test', { uid });
        session.set('data.group', testGroup);
    });

    test('visiting /create-cheevie', async function(assert) {
        await visit('/create-cheevie');

        assert.equal(currentURL(), '/create-cheevie');
    });

    test('it creates cheevie model and adds it to the group', async function(assert) {
        await visit('/create-cheevie');
        const group = this.owner.lookup('service:my-group');
        const cheevieModel = this.owner.lookup('controller:index.create-cheevie').model.cheevie;

        await fillIn('#name', 'test-cheevie-name');
        await click('label[for="high"]');
        await fillIn('#description', 'test-cheevie-description');
        await triggerEvent('form', 'submit');

        await sleep(1000);

        assert.equal(cheevieModel.get('name'), 'test-cheevie-name');
        assert.equal(cheevieModel.power, 'high');
        assert.equal(cheevieModel.description, 'test-cheevie-description');

        let groupCheevies = await group.model.get('cheevies');
        groupCheevies = groupCheevies.map(g => g.id);

        // cheevie added in group
        assert.ok(groupCheevies.indexOf(cheevieModel.id) > -1);
    });
});
