import Controller from '@ember/controller';
import { schedule } from '@ember/runloop';
import { inject as service } from '@ember/service';
import { computed } from '@ember/object';
import { resolve, hash } from 'rsvp';

export default Controller.extend({
    session: service(),
    me: service(),
    activity: service(),

    myModel: computed.alias('me.model'),
    imageSet: computed.readOnly('myModel.image-set'),
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
        this.passwordSignInSuccess = this.passwordSignInSuccess.bind(this);
    },

    passwordSignInSuccess() {
        return this.me.fetch();
    },

    onSuccess() {
        return resolve()
            .then(() =>
                this.send('notify', {
                    type: 'info',
                    text: this.get('i18n').t('messages.welcome_default'),
                })
            )
            .then(() =>
                this.activity.send({
                    action: 'logged',
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
        passwordSignIn() {
            if (this.model.validate({ except: ['group'] })) {
                return this.get('session')
                    .authenticate('authenticator:firebase', {
                        email: this.get('model.email'),
                        password: this.get('model.password'),
                    })
                    .then(this.passwordSignInSuccess, this.onError);
            }
        },
        selectGroup() {
            if (this.model.validate({ except: ['email', 'password'] })) {
                return this.me.fetch().then(() =>
                    this.store
                        .query('group', {
                            orderBy: 'name',
                            equalTo: this.getWithDefault('model.group', '')
                                // .toLowerCase()  // todo: check this
                                .trim(),
                        })
                        .then(groups => {
                            // 1. No groups found -> show error
                            if (!groups.length) {
                                throw new Error(this.get('i18n').t('login.messages.no_such_group'));
                            }

                            // 2. Group found
                            var group = groups.firstObject;

                            // 2.1 You are not in group
                            if (group.users.indexOf(this.me.model) < 0) {
                                // Group is locked -> show error
                                if (group.locked) {
                                    throw new Error(
                                        this.get('i18n').t('login.messages.group_is_locked')
                                    );
                                }

                                // Group is public -> pass
                                group.users.pushObject(this.me.model);
                                this.me.model.groups.pushObject(group);
                                return hash({
                                    group: group.save(),
                                    me: this.me.model.save(),
                                });
                            }

                            return { group };
                        })
                        .then(({ group }) => {
                            this.get('session').set('data.group', group.name);
                            return group.reload();
                        })
                        .then(this.onSuccess, this.onError)
                );
            }
        },
        invalidate() {
            return this.get('session').invalidate();
        },
    },
});
