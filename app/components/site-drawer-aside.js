import Component from 'site-drawer-component/components/site-drawer-aside';
import { inject as service } from '@ember/service';
import { computed } from '@ember/object';
import DS from 'ember-data';

export default Component.extend({
  me: service(),
  session: service(),
  myGroup: service(),
  router: service(),
  avatar: computed.readOnly('me.model.image-set'),

  cheevies: computed('me.model.cheevies.[]', function() {
    return DS.PromiseArray.create({
      promise: this.get('myGroup')
        .fetch()
        .then(myGroup => myGroup.get('cheevies'))
        .then(availableCheevies =>
          this.me.model.cheevies.filter(
            cheevie => availableCheevies.indexOf(cheevie) > -1
          )
        ),
    });
  }),

  actions: {
    createCheevie() {
      this.get('router').transitionTo('index.create-cheevie');
    },
    invalidate() {
      return this.session
        .invalidate()
        .then(() => this.get('router').transitionTo('login'));
    },
  },
});
