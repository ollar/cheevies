import Service, { inject as service } from '@ember/service';
import { computed } from '@ember/object';

export default Service.extend({
    store: service(),
    me: service(),
    myGroup: service('my-group'),

    lastFetchedActivity: computed({
        get(key) {
            return window.localStorage.getItem(`${key}::${this.myGroup.groupName}`);
        },
        set(key, value) {
            window.localStorage.setItem(`${key}::${this.myGroup.groupName}`, value);
            return value;
        },
    }),

    fetch() {
        return this.myGroup.fetch().then(() =>
            this.store
                .query('activity', {
                    orderBy: 'group',
                    equalTo: this.myGroup.model.id,
                    limitToLast: 20,
                })
                .then(activities =>
                    activities.filter(
                        activity => activity.created >= +this.get('lastFetchedActivity')
                    )
                )
                .then(activities => {
                    this.set('lastFetchedActivity', Date.now());
                    return activities.reverse();
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
