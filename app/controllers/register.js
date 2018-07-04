import Controller from '@ember/controller';

export default Controller.extend({
  actions: {
    handleSubmit() {
      if (this.model.validate()) {
        this.model
          .signUp()
          .then(() => {
            this.transitionToRoute('index');
          })
          .catch(e => {
            this.send('notify', 'error', e.toString());
          });
      }
    },
  },
});
