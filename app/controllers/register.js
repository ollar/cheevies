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
      this.get('session').register(this.get('fields.email'), this.get('fields.password'))
        .then((newUser) => {
          return newUser.updateProfile({
            displayName: this.get('fields.name'),
          })
          .then(() => {
            let user = this.get('store').createRecord('user', {
              name: this.get('fields.name'),
              photoURL: '',
              email: this.get('fields.email'),
            });

            user.save();
          });
        })
        .then(() => {
          return this.get('session').fetch().then(() => {
            this.transitionToRoute('index');
          });
        })
        .catch((e) => {
          this.send('notify', 'error', e.toString());
        });
    },

    goToLogin() {
      this.transitionToRoute('login');
    }
  },
});
