import Controller from '@ember/controller';

export default Controller.extend({
  fields: {
    name: '',
    description: '',
  },

  actions: {
    createBadge() {
      const badge = this.get('store').createRecord('badge', {
        name: this.get('fields.name'),
        description: this.get('fields.description'),
      });

      badge.save();
      this.transitionToRoute('index');
    },
    goBack() {
      this.transitionToRoute('index');
    }
  }
});
