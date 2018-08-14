import Controller from '@ember/controller';

export default Controller.extend({
  actions: {
    goBack() {
      return window.history.back();
    },

    pickCheevie(cheevie) {
      const user = this.model.user;
      user.get('cheevies').pushObject(cheevie);
      user.save().then(() => window.history.back());
    },
  },
});
