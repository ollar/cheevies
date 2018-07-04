import Controller from '@ember/controller';

export default Controller.extend({
  actions: {
    passwordSignIn() {
      if (this.model.validate()) {
        return this.get('session')
          .open('firebase', {
            provider: 'password',
            email: this.get('model.email'),
            password: this.get('model.password'),
          })
          .then(() => {
            this.send(
              'notify',
              'info',
              this.get('i18n').t('messages.welcome_default')
            );
            this.transitionToRoute('index');
          })
          .catch(e => {
            this.send('notify', 'error', e.toString());
          });
      }
    },
  },
});
