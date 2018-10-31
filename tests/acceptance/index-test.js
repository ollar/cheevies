import { module, test } from 'qunit';
import { visit, currentURL, settled } from '@ember/test-helpers';
import { setupApplicationTest } from 'ember-qunit';
import Service from '@ember/service';
import { computed } from '@ember/object';
import { resolve } from 'rsvp';
import { testGroup, cheevieModel, meStub, settingsStub } from './common-stubs';

const sessionStub = Service.extend({
    isAuthenticated: false,
    data: computed(() => ({ authenticated: {} })),
});

const storeStub = Service.extend({
    cheevieModel: cheevieModel.create(),
    testGroup: testGroup.create(),
    query() {
        return resolve([this.testGroup]);
    },

    createRecord() {
        return this.cheevieModel;
    },

    peekAll() {
        return [];
    },
});

const myGroupStub = Service.extend({
    groupName: 'test',
    model: testGroup.create(),
    fetch() {
        return resolve(this.model);
    },
});

module('Acceptance | index', function(hooks) {
    setupApplicationTest(hooks);

    hooks.beforeEach(function() {
        this.owner.register('service:session', sessionStub);
        this.owner.register('service:my-group', myGroupStub);
        this.owner.register('service:me', meStub);
        this.owner.register('service:settings', settingsStub);
        this.owner.register('service:store-test', storeStub);
        this.owner.inject('route:index', 'store', 'service:store-test');
    });

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
        this.owner.lookup('service:session').set('isAuthenticated', true);
        this.owner.lookup('service:session').set('data.group', 'true');

        await visit('/');

        assert.equal(currentURL(), '/');
    });
});
