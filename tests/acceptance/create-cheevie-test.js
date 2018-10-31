import { module, test } from 'qunit';
import { visit, currentURL, fillIn, settled, click, triggerEvent } from '@ember/test-helpers';
import { setupApplicationTest } from 'ember-qunit';
import Service from '@ember/service';
import { computed } from '@ember/object';
import { resolve } from 'rsvp';
import {
    testGroup,
    cheevieModel,
    myGroupStub,
    meStub,
    settingsStub,
    activityStub,
} from './common-stubs';

const sessionServiceStub = Service.extend({
    isAuthenticated: true,
    data: computed(() => ({
        group: 'tester',
        authenticated: {},
    })),
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

module('Acceptance | create cheevie', function(hooks) {
    setupApplicationTest(hooks);

    hooks.beforeEach(function() {
        this.owner.register('service:session', sessionServiceStub);
        this.owner.register('service:store-test', storeStub);
        this.owner.register('service:my-group', myGroupStub);
        this.owner.register('service:settings', settingsStub);
        this.owner.register('service:activity', activityStub);
        this.owner.register('service:me', meStub);
        this.owner.inject('route:index', 'store', 'service:store-test');
        this.owner.inject('route:index.create-cheevie', 'store', 'service:store-test');
    });

    test('visiting /create-cheevie', async function(assert) {
        await visit('/create-cheevie');

        assert.equal(currentURL(), '/create-cheevie');
    });

    test('it creates cheevie model and adds it to the group', async function(assert) {
        const cheevieModel = this.owner.lookup('service:store-test').cheevieModel;
        const testGroup = this.owner.lookup('service:my-group').model;

        await visit('/create-cheevie');

        await fillIn('#name', 'test-cheevie-name');
        await click('label[for="high"]');
        await fillIn('#description', 'test-cheevie-description');

        await triggerEvent('form', 'submit');
        await settled();

        assert.equal(cheevieModel.get('name'), 'test-cheevie-name');
        assert.equal(cheevieModel.power, 'high');
        assert.equal(cheevieModel.description, 'test-cheevie-description');

        assert.ok(testGroup.cheevies.length === 1);
    });
});
