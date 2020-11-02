import Service, { inject as service } from '@ember/service';
import { tracked } from '@glimmer/tracking';

export default class SettingsService extends Service {
    @service session;
    @service me;
    @service myGroup;
    @service store;

    @tracked model;

    get myModel() {
        return this.me.model;
    }

    get isDemo() {
        return this.myGroup.isDemo;
    }

    get _type() {
        return this.isDemo ? 'demo/settings' : 'settings';
    }

    constructor() {
        super(...arguments);
        this.session.on('invalidationSucceeded', () => {
            this.model = null;
        });
    }

    fetch() {
        return this.me.fetch().then(() => {
            if (this.model) return this.model;

            return this.myModel.get('settings').then(settings => {
                if (settings) {
                    this.model = settings;
                    return settings;
                } else {
                    settings = this.store.createRecord(this._type, {
                        user: this.myModel,
                    });

                    this.myModel.set('settings', settings);

                    return Promise.all([
                        this.myModel.save(),
                        settings.save()
                    ])
                    .then(() => {
                        this.model = settings;
                        return settings;
                    });
                }
            });
        });
    }

    save() {
        const model = this.model;
        model.set('updated', Date.now());
        return model.save();
    }
}
