import Controller from '@ember/controller';

export default Controller.extend({
  init() {
    this._super(...arguments);
    this.fields = {
      name: '',
      description: '',
    };
  },

  actions: {
    createBadge() {
      const badge = this.store.createRecord('badge', {
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
