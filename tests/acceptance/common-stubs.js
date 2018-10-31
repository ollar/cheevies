import EmberObject, { computed } from '@ember/object';
import { resolve } from 'rsvp';
import Service from '@ember/service';

export const testGroup = EmberObject.extend({
    id: 'myGroup',
    name: 'test',
    users: computed(() => []),
    cheevies: computed(() => []),
    save() {
        return resolve();
    },
    reload() {
        return resolve();
    },
});

export const settigsStubModel = EmberObject.extend({
    save() {
        return resolve();
    },
    reload() {
        return resolve();
    },
});

export const meModel = EmberObject.extend({
    id: 'me',
    email: 'test@test.test',
    fcmToken: 'string',

    cheevies: computed(() => []),
    unseenCheevies: computed(() => []),
    badges: computed(() => []),
    groups: computed(() => []),

    settings: computed(() => resolve(1)),

    save() {},
});

export const myGroupStub = Service.extend({
    groupName: 'test',
    model: testGroup.create(),
    fetch() {
        return resolve(this.model);
    },
});

export const settingsStub = Service.extend({
    model: settigsStubModel.create(),
    fetch() {
        return resolve(this.model);
    },
});

export const activityStub = Service.extend({
    fetch() {
        return resolve();
    },
    send() {
        return resolve();
    },
});

export const cheevieModel = EmberObject.extend({
    rates: computed(() => ['low', 'normal', 'high']),
    save() {
        return resolve();
    },
});

export const meStub = Service.extend({
    _me: computed(function() {
        return meModel.create();
    }),
    fetch() {
        return resolve(this._me);
    },
    model: computed(function() {
        return this._me;
    }),
});
