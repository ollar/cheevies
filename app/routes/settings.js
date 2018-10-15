import Route from '@ember/routing/route';
import { inject as service } from '@ember/service';

export default Route.extend({
    me: service(),

    model() {
        return this.me.fetch().then(myModel => {
            return this.store
                .query('settings', {
                    orderBy: 'user',
                    equalTo: myModel.id,
                })
                .then(settingsModel => {
                    if (settingsModel && settingsModel.length) return settingsModel.firstObject;

                    return this.store.createRecord('settings', {
                        user: this.me.model,
                    });
                });
        });
    },
});
