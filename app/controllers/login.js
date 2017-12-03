import Controller from '@ember/controller';
import { computed } from '@ember/object';

export default Controller.extend({
  fields: computed(function() {
    return {
      email: '',
      password: '',
    };
  }),

  actions: {
    passwordSignIn() {
      return this.get('session').open('firebase', {
        provider: 'password',
        email: this.get('fields.email'),
        password: this.get('fields.password'),
      })
      .then(() => {
        this.send('notify', 'info', this.get('i18n').t('messages.welcome_default'));
        this.transitionToRoute('index');
      })
      .catch((e) => {
        this.send('notify', 'error', e.toString());
      });
    },

    goToRegister() {
      this.transitionToRoute('register');
    }
  },
});