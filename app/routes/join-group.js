import { readOnly } from '@ember/object/computed';
import Route from '@ember/routing/route';
import { inject as service } from '@ember/service';
import { computed } from '@ember/object';
import { hash, all } from 'rsvp';
import { schedule } from '@ember/runloop';

export default Route.extend({
    session: service(),
    intl: service(),
    me: service(),
    isAuthenticated: readOnly('session.isAuthenticated'),

    redirectToSignIn({ group_id }, transition) {
        const queryParams = transition.queryParams;

        return new Promise(res => {
            this.store.createRecord('join-group', {
                group_id,
                queryParams,
            });
            transition.send('notify', {
                type: 'info',
                text: this.intl.t('join-group.messages.attempt-signin'),
            });
            this.transitionTo('wardrobe.sign-in');
            transition.abort();
            return res();
        });
    },

    model({ group_id }, transition) {
        const queryParams = transition.queryParams;

        if (!queryParams.code) {
            throw new Error(this.intl.t('join-group.messages.broken_link'));
        }

        if (this.session.get('data.demoGroup')) {
            this.session.invalidate()
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
                this.session.set('data.group', group.name);

                transition.send('notify', {
                    type: 'success',
                    text: this.intl.t('join-group.messages.success', {
                        groupName: group.name,
                        username: me.name,
                    }),
                });

                return all([group.save(), me.save()]);
            })
            .then(() => schedule('routerTransitions', () => this.transitionTo('index')));
    },

    actions: {
        error(error, transition) {
            transition.abort();
            transition.send('notify', {
                type: 'error',
                text: error.message,
            });
            this.transitionTo('login');
        },
    },
});
