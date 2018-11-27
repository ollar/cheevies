import { module, test } from 'qunit';
import { visit, currentURL } from '@ember/test-helpers';
import { setupApplicationTest } from 'ember-qunit';

import { testgroup, uid, testcheevie } from '../consts';

module('Acceptance | new cheevie', function(hooks) {
    setupApplicationTest(hooks);

    test('visiting / should redirect to /new-cheevie', async function(assert) {
        const session = this.owner.lookup('service:session');
        const me = this.owner.lookup('service:me');
        const myGroup = this.owner.lookup('service:my-group');

        await session.authenticate('authenticator:test', { uid });
        session.set('data.group', testgroup);

        await me.fetch();
        await myGroup.fetch();

        const unseenCheevie = this.owner
            .lookup('service:store')
            .createRecord('cheevie', { name: testcheevie });

        me.model.get('unseenCheevies').addObject(unseenCheevie);
        myGroup.model.get('cheevies').addObject(unseenCheevie);

        await visit('/');

        assert.equal(currentURL(), '/new-cheevies');
    });
});
