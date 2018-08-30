import Component from '@ember/component';
import { computed } from '@ember/object';
import HaoticMoveMixin from '../mixins/haotic-move';
import DraggableMixin from '../mixins/draggable';
import { inject as service } from '@ember/service';
import DS from 'ember-data';

export default Component.extend(HaoticMoveMixin, DraggableMixin, {
  myGroup: service('my-group'),

  cheevies: computed('model.cheevies.[]', function() {
    return DS.PromiseArray.create({
      promise: this.get('myGroup')
        .fetch()
        .then(myGroup => myGroup.get('cheevies'))
        .then(availableCheevies =>
          this.user.cheevies.filter(
            cheevie => availableCheevies.indexOf(cheevie) > -1
          )
        ),
    });
  }),

  classNames: ['user-in-list'],
  avatar: computed.readOnly('user.image-set.128'),
});
