import { alias, readOnly } from '@ember/object/computed';
import Controller from '@ember/controller';
import { computed } from '@ember/object';
import { inject as service } from '@ember/service';
import { schedule } from '@ember/runloop';
import { resolve, hash } from 'rsvp';

export default Controller.extend({
    me: service(),
    session: service(),
    intl: service(),

    myModel: alias('me.model'),
    imageSet: readOnly('myModel.image-set'),
    myImage: computed('imageSet.{}', function() {
        if (!this.get('imageSet.64')) return null;
        return {
            sm: this.get('imageSet.64'),
            md: this.get('imageSet.128'),
            lg: this.get('imageSet.256'),
        };
    }),

    init() {
        this._super(...arguments);

        this.onSuccess = this.onSuccess.bind(this);
        this.onError = this.onError.bind(this);
    },

    onSuccess() {
        return resolve()
            .then(() =>
                this.send('notify', {
                    type: 'info',
                    text: this.intl.t('messages.welcome_default'),
                })
            )
            .then(() => schedule('routerTransitions', () => this.transitionToRoute('index')));
    },

    onError(err) {
        this.send('notify', {
            type: 'error',
            text: err.message,
        });
    },

    actions: {
        // todo refactor to make it universal
        selectGroup() {
            if (this.model.validate()) {
                return this.me.fetch().then(() =>
                    this.store
                        .queryRecord('group', {
                            orderBy: 'name',
                            equalTo: this.getWithDefault('model.group', '')
                                .toLowerCase() // todo: check this
                                .trim(),
                        })
                        .then(group => {
                            // 1. No groups found -> show error
                            if (!group) {
                                throw new Error(this.intl.t('login.messages.no_such_group'));
                            }

                            // 2. Group found
                            // 2.1 You are not in group
                            return hash({
                                group,
                                users: group.get('users')
                            });
                        })
                        .then(({ group, users }) => {
                            if (group.users.indexOf(this.me.model) < 0) {
                                // Group is locked -> show error
                                if (group.locked) {
                                    throw new Error(
                                        this.intl.t('login.messages.group_is_locked')
                                    );
                                }

                                debugger
                                // Group is public -> pass
                                group.users.pushObject(this.me.model);
                                this.me.model.groups.pushObject(group);
                                return hash({
                                    group: group.save(),
                                    me: this.me.model.save(),
                                });
                            }

                            return {
                                group,
                            };
                        })
                        .then(({ group }) => {
                            this.session.set('data.group', group.name);
                            return group.reload();
                        })
                        .then(this.onSuccess, this.onError)
                );
            }
        },

        invalidate() {
            return this.session
                .invalidate()
                .then(() => {
                    schedule('routerTransitions', () => window.history.back());
                });
        },
    },
});
