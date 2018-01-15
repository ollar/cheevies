import Controller from '@ember/controller';

export default Controller.extend({
  actions: {
    goBack() {
      this.model.set('unseenCheevies', []);
      this.model.save();
      this.transitionToRoute('index');
    }
  }
});
