import Route from '@ember/routing/route';
import { inject as service } from '@ember/service';
import { hash } from 'rsvp';

export default Route.extend({
    notify: service(),
    me: service(),
    myGroup: service('my-group'),
    installStandalone: service('install-standalone'),

    init() {
        this._super(...arguments);
        this.notificationTypes = ['info', 'success', 'warning', 'error'];
        this.installStandalone.addListeners();
    },
    afterModel() {
        // TODO: refactor this. maybe move this to index
        if (this.me.model) {
            hash({
                myGroup: this.myGroup.fetch(),
                me: this.me.fetch(),
            })
                .then(({ myGroup, me }) => ({
                    availableCheevies: myGroup.get('cheevies'),
                    unseenCheevies: me.get('unseenCheevies'),
                }))
                .then(({ availableCheevies, unseenCheevies }) =>
                    unseenCheevies.filter(cheevie => availableCheevies.indexOf(cheevie) > -1)
                )
                .then(unseenCheevies => {
                    if (unseenCheevies.length) this.transitionTo('index.new-cheevies');
                });
        }
    },
    actions: {
        notify({ type, text }) {
            if (this.get('notificationTypes').indexOf(type) === -1) {
                throw new Error(text);
            }
            return this.get('notify')[type](text);
        },
    },
});
