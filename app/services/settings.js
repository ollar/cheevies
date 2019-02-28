import Service from '@ember/service';
import {
    inject as service
} from '@ember/service';
import {
    all
} from 'rsvp';
import {
    computed
} from '@ember/object';

export default Service.extend({
    session: service(),
    me: service(),
    myGroup: service(),
    store: service(),
    myModel: computed.alias('me.model'),
    model: null,

    isDemo: computed.readOnly('myGroup.isDemo'),

    _type: computed('isDemo', function () {
        return this.isDemo ? 'demo/settings' : 'settings';
    }),

    init() {
        this._super(...arguments);
        this.session.on('invalidationSucceeded', () => {
            this.set('model', null);
        });
    },

    fetch() {
        return this.me.fetch().then(() => {
            if (this.model) return this.model;

            return this.myModel.get('settings').then(settings => {
                if (settings) {
                    this.set('model', settings);
                    return settings;
                } else {
                    settings = this.store.createRecord(this._type, {
                        user: this.myModel,
                    });

                    this.myModel.set('settings', settings);

                    return all([this.myModel.save(), settings.save()]).then(() => {
                        this.set('model', settings);
                        return settings;
                    });
                }
            });
        });
    },

    save() {
        const model = this.model;
        model.set('updated', Date.now());
        return model.save();
    },
});
