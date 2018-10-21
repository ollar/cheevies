import Service, { inject as service } from '@ember/service';

export default Service.extend({
    store: service(),
    me: service(),
    myGroup: service('my-group'),

    fetch() {
        return this.myGroup.fetch().then(() =>
            this.store.query('activity', {
                orderBy: 'group',
                equalTo: this.myGroup.model.id,
            })
        );
    },

    send({ action, text, cheevie }) {
        const activity = this.store.createRecord('activity', {
            group: this.myGroup.model,
            user: this.me.model,
            cheevie: cheevie,
            created: Date.now(),
            action,
            text,
        });

        return activity.save();
    },
});
