import Controller from '@ember/controller';
import { computed } from '@ember/object';
import { inject as service } from '@ember/service';
import { schedule } from '@ember/runloop';

export default Controller.extend({
    me: service(),
    session: service(),
    activity: service(),

    myModel: computed.alias('me.model'),
    imageSet: computed.readOnly('myModel.image-set'),
    myImage: computed('imageSet.{}', function() {
        if (!this.get('imageSet.64')) return null;
        return {
            sm: this.get('imageSet.64'),
            md: this.get('imageSet.128'),
            lg: this.get('imageSet.256'),
        };
    }),

    init() {
        this._super(...arguments);
        this.me.fetch();
    },

    actions: {
        invalidate() {
            return this.get('session')
                .invalidate()
                .then(() => {
                    schedule('routerTransitions', () => window.history.back());
                });
        },
    },
});
