import Service, { inject as service } from '@ember/service';

export default Service.extend({
    store: service(),
    me: service(),
    myGroup: service('my-group'),

    pushActivity(data) {
        const activity = this.store.createRecord('activity', {
            group: this.myGroup.model,
            user: this.me.model,
            created: Date.now(),
            data,
        });

        return activity.save();
    },
});
