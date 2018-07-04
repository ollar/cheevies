import Controller from '@ember/controller';
import { computed } from '@ember/object';

export default Controller.extend({
  fields: computed(function() {
    return {
      name: '',
      email: '',
      password: '',
    };
  }),

  actions: {
    handleSubmit() {
      this.get('session')
        .register(this.get('fields.email'), this.get('fields.password'))
        .then(() => {
          return this.get('session')
            .fetch()
            .then(() => {
              this.transitionToRoute('index');
            });
        })
        .catch(e => {
          this.send('notify', 'error', e.toString());
        });
    },

    goToLogin() {
      this.transitionToRoute('login');
    },
  },
});
