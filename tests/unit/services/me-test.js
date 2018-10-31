import { module, test } from 'qunit';
import { setupTest } from 'ember-qunit';
import Service from '@ember/service';
import { computed } from '@ember/object';

const sessionStub = Service.extend({
    isAuthenticated: true,
    data: computed(() => ({
        authenticated: {
            uid: '1',
        },
    })),
    on: () => false,
});

const user = {
    id: '1',
    name: 'tester pal',
};

const storeStub = Service.extend({
    findRecord() {
        return Promise.resolve(user);
    },
});

module('Unit | Service | me', function(hooks) {
    setupTest(hooks);

    hooks.beforeEach(function() {
        this.owner.register('service:session', sessionStub);
        this.owner.register('service:store', storeStub);
    });

    // Replace this with your real tests.
    test('it exists', function(assert) {
        let service = this.owner.lookup('service:me');
        assert.ok(service);
    });

    test('isAuthenticated', function(assert) {
        let service = this.owner.lookup('service:me');
        assert.ok(service.get('isAuthenticated'));
    });

    test('not isAuthenticated', function(assert) {
        this.owner.lookup('service:session').set('isAuthenticated', false);

        let service = this.owner.lookup('service:me');
        assert.notOk(service.get('isAuthenticated'));
    });

    test('isAuthenticated and fetches user', async function(assert) {
        let service = this.owner.lookup('service:me');
        service.set('store', storeStub.create());

        let _user = await service.fetch();

        assert.equal(_user.name, user.name);
        assert.equal(service.model.name, user.name);
    });

    test('not isAuthenticated, fetches user, get promise reject', async function(assert) {
        this.owner.lookup('service:session').set('isAuthenticated', false);

        let service = this.owner.lookup('service:me');
        service.set('store', storeStub.create());

        let _user = service.fetch();

        assert.rejects(_user);
        assert.notOk(service.model);
    });
});
