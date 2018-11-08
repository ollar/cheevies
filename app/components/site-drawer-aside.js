import Component from 'site-drawer-component/components/site-drawer-aside';
import { inject as service } from '@ember/service';
import { computed } from '@ember/object';
import DS from 'ember-data';
import { resolve } from 'rsvp';

export default Component.extend({
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

    cheevies: computed('me.model.cheevies.[]', 'myGroup.groupName', function() {
        if (!this.get('myGroup.groupName')) return;
        return DS.PromiseArray.create({
            promise: this.get('myGroup')
                .fetch()
                .then(myGroup => {
                    if (!myGroup) return resolve([]);
                    return myGroup
                        .get('cheevies')
                        .then(cheevies => cheevies.filter(c => !c.deleted));
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
