import Route from '@ember/routing/route';
import { inject as service } from '@ember/service';
import { action } from '@ember/object';

import { hash, all } from 'rsvp';

export default class JoinGroupRoute extends Route {
    @service session;
    @service intl;
    @service me;

    get isAuthenticated() {
        return this.session.isAuthenticated;
    }

    get isDemo() {
        return this.session.data.authenticated.demoGroup;
    }

    beforeModel(transition) {
        const { queryParams } = transition.to;
        if (!queryParams || !queryParams.code) {
            throw new Error(this.intl.t('join-group.messages.broken_link'));
        }
    }

    redirectToSignIn({ group_id }, transition) {
        const { queryParams } = transition.to;

        return new Promise(res => {
            this.store.createRecord('join-group', {
                group_id,
                queryParams,
            });
            // transition.send('notify', {
            //     type: 'info',
            //     text: this.intl.t('join-group.messages.attempt-signin'),
            // });
            this.transitionTo('wardrobe.sign-in');
            transition.abort();
            return res();
        });
    }

    model({ group_id }, transition) {
        const { queryParams } = transition.to;

        if (this.isDemo) {
            return this.session.invalidate()
                .then(() => this.redirectToSignIn({ group_id }, transition));
        }

        if (!this.isAuthenticated) {
            return this.redirectToSignIn({ group_id }, transition);
        }

        return hash({
            group: this.store.findRecord('group', group_id),
            me: this.me.fetch(),
        })
            .then(({ group, me }) => {
                if (group.code !== queryParams.code) {
                    throw new Error(this.intl.t('join-group.messages.access_code_wrong'));
                }

                group.users.addObject(me);
                me.groups.addObject(group);
                this.session.persist('group', group.name);

                this.send('notify', {
                    type: 'success',
                    text: this.intl.t('join-group.messages.success', {
                        groupName: group.name,
                        username: me.name,
                    }),
                });

                return all([group.save(), me.save()]);
            })
            .then(() => this.transitionTo('index'));
    }

    @action
    error(error, transition) {
        transition.abort();
        this.send('notify', {
            type: 'error',
            text: error.message,
        });
        this.transitionTo('login');
    }
}
