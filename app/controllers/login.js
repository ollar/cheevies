import Controller from '@ember/controller';
import { schedule } from '@ember/runloop';
import { inject as service } from '@ember/service';

export default Controller.extend({
  session: service(),

  init() {
    this._super(...arguments);

    this.onSuccess = this.onSuccess.bind(this);
    this.onError = this.onError.bind(this);
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
      if (this.model.validate()) {
        return this.get('session')
          .authenticate('authenticator:firebase', {
            email: this.get('model.email'),
            password: this.get('model.password'),
          })
          .then(this.onSuccess, this.onError);
      }
    },
  },
});
