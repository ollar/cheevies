import Component from 'site-drawer-component/components/site-drawer-aside';
import { inject as service } from '@ember/service';
import { computed } from '@ember/object';
import DS from 'ember-data';
import { resolve } from 'rsvp';

import DraggableMixin from 'draggable-mixin/mixins/draggable';

export default Component.extend(DraggableMixin, {
    me: service(),
    myGroup: service(),
    router: service(),

    imageSet: computed.readOnly('me.model.image-set'),
    image: computed('imageSet.{}', function() {
        if (!this.get('imageSet.128')) return null;
        return {
            sm: this.get('imageSet.256'),
            md: this.get('imageSet.512'),
        };
    }),

    panDirection() {
        return this.DIRECTION_HORIZONTAL;
    },

    handlePanMove(ev) {
        if (this.initialTransform[0] + ev.deltaX >= 300) return;
        this._super(ev);
    },

    onPanEnvComplete() {
        const moveX = this.initialTransform[0] - this.previousMoveX;
        if (Math.abs(moveX) > 150) {
            if (moveX > 0) {
                this.closeDrawer(); // close it
            }
        }
        this._super(...arguments);
    },

    cheevies: computed('me.model.cheevies.[]', 'myGroup.groupName', function() {
        if (!this.get('myGroup.groupName')) return;
        return DS.PromiseArray.create({
            promise: this.myGroup
                .fetch()
                .then(myGroup => {
                    if (!myGroup) return resolve([]);
                    return this.myGroup.cheevies;
                })
                .then(availableCheevies =>
                    this.getWithDefault('me.model.cheevies', []).filter(
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
            return this.get('router').transitionTo('logout');
        },
    },
});
