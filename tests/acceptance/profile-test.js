import { module, test } from 'qunit';
import { visit, currentURL } from '@ember/test-helpers';
import { setupApplicationTest } from 'ember-qunit';

import { testgroup, uid } from '../consts';

module('Acceptance | profile', function(hooks) {
    setupApplicationTest(hooks);

    test('visiting /profile', async function(assert) {
        const session = this.owner.lookup('service:session');
        await session.authenticate('authenticator:test', { uid });
        session.set('data.group', testgroup);

        await visit(`/profile/${uid}`);

        assert.equal(currentURL(), `/profile/${uid}`);
    });
});
