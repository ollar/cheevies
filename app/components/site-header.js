import Component from '@ember/component';

export default Component.extend({
  tagName: 'header',
  classNames: ['header'],

  actions: {
    toggleDrawer() {
      this._drawerData.toggleDrawer();
    },
  },
});
