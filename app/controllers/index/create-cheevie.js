import Controller from '@ember/controller';

export default Controller.extend({
  fields: {
    name: '',
    description: '',
  },
  actions: {
    createCheevie() {
      const cheevie = this.get('store').createRecord('cheevie', {
        name: this.get('fields.name'),
        description: this.get('fields.description'),
      });

      cheevie.save();
      this.transitionToRoute('index');
    },
    goBack() {
      this.transitionToRoute('index');
    }
  }
});
