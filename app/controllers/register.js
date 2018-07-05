import Controller from '@ember/controller';
import { schedule } from '@ember/runloop';
import { inject as service } from '@ember/service';
import { computed } from '@ember/object';

export default Controller.extend({
  i18n: service(),
  session: service(),

  uid: computed('session.isAuthenticated', function() {
    if (!this.get('session.isAuthenticated')) return '';
    return this.getWithDefault('session.data.authenticated.uid', '');
  }),

  actions: {
    handleSubmit() {
      if (this.model.validate()) {
        this.model
          .signUp()
          .then(() =>
            this.send('notify', {
              type: 'success',
              text: this.get('i18n').t('signup.success_message'),
            })
          )
          .then(() => {
            schedule('routerTransitions', () =>
              this.transitionToRoute('index')
            );
          })
          .catch(err =>
            this.send('notify', {
              type: 'error',
              text: err.message,
            })
          );
      }
    },
  },
});
