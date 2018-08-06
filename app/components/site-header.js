import Component from '@ember/component';
import { inject as service } from '@ember/service';
import { computed } from '@ember/object';

export default Component.extend({
  tagName: 'header',
  classNames: ['header'],
  router: service(),

  currentRouteName: computed.readOnly('router.currentRouteName'),
  isIndex: computed('currentRouteName', function() {
    return this.currentRouteName.match('index');
  }),

  actions: {
    goBack() {
      return window.history.back();
    },
    toggleDrawer() {
      this._drawerData.toggleDrawer();
    },
  },
});
