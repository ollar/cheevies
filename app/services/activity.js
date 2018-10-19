import Service, { inject as service } from '@ember/service';

export default Service.extend({
    store: service(),
    me: service(),
    myGroup: service('my-group'),

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
