import Controller from '@ember/controller';
import { schedule, later } from '@ember/runloop';
import { inject as service } from '@ember/service';
import { computed } from '@ember/object';
import { resolve, all } from 'rsvp';

export default Controller.extend({
    me: service(),
    session: service(),
    activity: service(),

    myModel: computed.alias('me.model'),

    init() {
        this._super(...arguments);

        this.onSuccess = this.onSuccess.bind(this);
        this.onError = this.onError.bind(this);
        this.onRegisterSuccess = this.onRegisterSuccess.bind(this);
    },

    onRegisterSuccess() {
        return this.me.fetch().then(() => {
            this.myModel.set('name', this.model.name);
            return this.myModel.save();
        });
    },

    onSuccess() {
        return resolve()
            .then(() =>
                this.send('notify', {
                    type: 'success',
                    text: this.get('i18n').t('register.success_message'),
                })
            )
            .then(() =>
                later(
                    () =>
                        this.activity.send({
                            action: 'registered',
                        }),
                    2000
                )
            )
            .then(() => {
                schedule('routerTransitions', () => this.transitionToRoute('index'));
            });
    },

    onError(err) {
        return this.send('notify', {
            type: 'error',
            text: err.message,
        });
    },

    actions: {
        handleRegister() {
            if (this.model.validate({ except: ['group'] })) {
                this.model
                    .signUp()
                    .then(() =>
                        this.session.authenticate('authenticator:firebase', {
                            email: this.get('model.email'),
                            password: this.get('model.password'),
                        })
                    )
                    .then(this.onRegisterSuccess, this.onError);
            }
        },

        selectGroup() {
            if (this.model.validate({ except: ['name', 'password', 'email'] })) {
                return this.me
                    .fetch()
                    .then(model => {
                        model.set('name', this.model.get('name'));
                        return model.save();
                    })
                    .then(() =>
                        this.store
                            .query('group', {
                                orderBy: 'name',
                                equalTo: this.model.group,
                            })
                            .then(groups => {
                                // 1. No groups found
                                if (!groups.length) {
                                    throw new Error(
                                        this.get('i18n').t('login.messages.no_such_group')
                                    );
                                }

                                // 2. Group found
                                var group = groups.firstObject;

                                // 2.1 You are not in group
                                // Group is locked -> show error
                                if (group.locked) {
                                    throw new Error(
                                        this.get('i18n').t('login.messages.group_is_locked')
                                    );
                                }

                                // Group is public -> pass
                                group.get('users').addObject(this.myModel);
                                this.myModel.get('groups').addObject(group);

                                this.get('session').set('data.group', group.name);
                                return all([group.save(), this.myModel.save()]);
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
