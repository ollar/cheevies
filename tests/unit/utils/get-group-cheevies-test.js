import getGroupCheevies from 'cheevies-jerk/utils/get-group-cheevies';
import { module, test } from 'qunit';
import { resolve } from 'rsvp';

import EmberObject from '@ember/object';

const Group = EmberObject.extend({
    cheevies: resolve([]),
});

module('Unit | Utility | get-group-cheevies', function(hooks) {
    // Replace this with your real tests.
    test('it works', async function(assert) {
        const group = Group.create();

        let result = await getGroupCheevies(group);
        assert.ok(result);
    });

    test('it gets cheevies', async function(assert) {
        const group = Group.create();
        group.set(
            'cheevies',
            resolve([{ deleted: false }, { deleted: false }, { deleted: false }])
        );

        let result = await getGroupCheevies(group);
        assert.ok(result);
    });

    test('it filters cheevies', async function(assert) {
        const group = Group.create();
        group.set('cheevies', resolve([{ deleted: true }, { deleted: false }, { deleted: false }]));

        let result = await getGroupCheevies(group);
        assert.equal(result.length, 2);
    });
});
