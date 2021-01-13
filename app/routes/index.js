import Route from '@ember/routing/route';
import { hash } from 'rsvp';
import { inject as service } from '@ember/service';
import { action } from '@ember/object';
import { schedule } from '@ember/runloop';

export default class IndexRoute extends Route {
    @service me;
    @service settings;
    @service myGroup;
    @service intl;
    @service session;

    get settingsModel() {
        return this.settings.model;
    }

    beforeModel(transition) {
        this.session.requireAuthentication(transition, 'wardrobe.sign-in');
        if (!this.myGroup.groupName) throw new Error('no groupName set');
    }

    model() {
        return this.myGroup
            .fetch()
            .then(group => {
                return hash({
                    me: this.me.fetch(),
                    users: group.get('users'),
                    cheevies: group.get('cheevies'),
                    settings: this.settings.fetch(),
                })
            });
    }

    @action
    error(e, transition) {
        console.log(e);
        transition.abort();
        this.transitionTo('wardrobe.sign-out').then(() => {
            this.send('notify', {
                type: 'error',
                text: this.intl.t('messages.app_init_error'),
            });
        });
    }

    afterModel() {
        if (this.me.model) {
            hash({
                myGroup: this.myGroup.fetch(),
                me: this.me.fetch(),
            })
                .then(({ me }) => ({
                    availableCheevies: this.myGroup.cheevies,
                    unseenCheevies: me.get('unseenCheevies'),
                }))
                .then(({ availableCheevies, unseenCheevies }) =>
                    unseenCheevies.filter(cheevie => availableCheevies.indexOf(cheevie) > -1)
                )
                .then(unseenCheevies => {
                    if (unseenCheevies.length) this.transitionTo('index.new-cheevies');
                });
        }
    }
}
