import Controller from '@ember/controller';
import { schedule } from '@ember/runloop';
import { inject as service } from '@ember/service';
import { computed } from '@ember/object';
import { resolve } from 'rsvp';

export default Controller.extend({
  session: service(),
  me: service(),

  myModel: computed('session.isAuthenticated', function() {
    return this.me.model;
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
        schedule('routerTransitions', () => this.transitionToRoute('index'))
      );
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
        return this.store
          .query('group', {
            orderBy: 'name',
            equalTo: this.getWithDefault('model.group', '')
              .toLowerCase()
              .trim(),
          })
          .then(groups => {
            if (!groups.length) {
              return this.onError({
                message: this.get('i18n').t('login.messages.no_such_group'),
              });
            }

            const myGroup = groups.firstObject;
            const myUid = this.get('me.model.id');

            if (myGroup.users.map(_u => _u.id).indexOf(myUid) > -1) {
              this.get('session').set('data.group', myGroup.id);
              return this.onSuccess();
            } else {
              return this.onError({
                message: this.get('i18n').t(
                  'login.messages.you_are_not_in_group'
                ),
              });
            }
          });
      }
    },
    invalidate() {
      return this.get('session').invalidate();
    },
  },
});
