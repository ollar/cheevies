import Controller from '@ember/controller';
import { schedule } from '@ember/runloop';
import { inject as service } from '@ember/service';
import { computed } from '@ember/object';
import { all, resolve } from 'rsvp';

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
                return this.me
                    .fetch()
                    .then(() =>
                        this.store
                            .query('group', {
                                orderBy: 'name',
                                equalTo: this.getWithDefault('model.group', '')
                                    // .toLowerCase()  // todo: check this
                                    .trim(),
                            })
                            .then(groups => {
                                // If user already created he can not create new group for now
                                // TODO create new group method

                                // if (!groups.length) {
                                //   return this.onError({
                                //     message: this.get('i18n').t('login.messages.no_such_group'),
                                //   });
                                // }
                                //

                                var group =
                                    groups.length > 0
                                        ? // group exists
                                          groups.firstObject
                                        : // group not exists
                                          this.store.createRecord('group', {
                                              name: this.model.group,
                                          });

                                group.get('users').addObject(this.myModel);
                                this.myModel.get('groups').addObject(group);
                                return all([group.save(), this.myModel.save()])
                                    .then(() => this.get('session').set('data.group', group.name))
                                    .then(() => group.reload());
                            })
                    )
                    .then(this.onSuccess, this.onError);
            }
        },
        invalidate() {
            return this.get('session').invalidate();
        },
    },
});
