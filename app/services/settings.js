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
        return this.isDemo ? 'demo/setting' : 'setting';
    }

    constructor() {
        super(...arguments);
        this.session.on('invalidationSucceeded', () => {
            this.model = null;
        });
    }

    async fetch() {
        await this.me.fetch();

        if (this.model) return this.model;

        let settings = await this.myModel.get('settings');

        if (settings) {
            this.model = settings;
            return settings;
        } else {
            settings = this.store.createRecord(this._type, {
                user: this.myModel,
            });

            await settings.save();

            this.myModel.set('settings', settings);

            await this.myModel.save();

            this.model = settings;
            return settings;
        }
    }

    save() {
        const model = this.model;
        model.set('updated', Date.now());
        return model.save();
    }
}
