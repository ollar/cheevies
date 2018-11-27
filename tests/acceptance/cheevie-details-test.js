import { module, test } from 'qunit';
import { visit, currentURL } from '@ember/test-helpers';
import { setupApplicationTest } from 'ember-qunit';

import { testgroup, uid, testcheevie } from '../consts';

module('Acceptance | cheevie details', function(hooks) {
    setupApplicationTest(hooks);

    test('visiting /cheevie-details', async function(assert) {
        const session = this.owner.lookup('service:session');
        await session.authenticate('authenticator:test', { uid });
        session.set('data.group', testgroup);

        await visit(`/cheevie/${testcheevie}`);

        assert.equal(currentURL(), `/cheevie/${testcheevie}`);
    });
});
