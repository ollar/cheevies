import Controller from '@ember/controller';
import { schedule } from '@ember/runloop';
import { inject as service } from '@ember/service';

export default Controller.extend({
  session: service(),
  me: service(),

  init() {
    this._super(...arguments);

    this.onSuccess = this.onSuccess.bind(this);
    this.onError = this.onError.bind(this);
    this.selectGroup = this.selectGroup.bind(this);
  },

  selectGroup() {
    return this.me.fetch().then(myModel => {
      console.log(myModel);
    });
  },

  onSuccess() {
    return Promise.resolve()
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
          .then(this.selectGroup, this.onError);
      }
    },
    selectGroup() {
      if (this.model.validate({ except: ['email', 'password'] })) {
        return this.store
          .query('group', {
            orderBy: 'name',
            equalTo: this.model.group,
          })
          .then(group => {
            if (!group.length) {
              return this.onError({
                message: this.get('i18n').t('login.messages.no_such_group'),
              });
            }

            const myGroup = group.firstObject;
            const myUid = this.get('me.model.id');

            if (myGroup.users.map(_u => _u.id).indexOf(myUid) > -1) {
              this.get('session').set('data.authenticated.group', myGroup.id);
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
