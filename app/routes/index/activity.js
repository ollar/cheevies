import Route from '@ember/routing/route';
import { inject as service } from '@ember/service';
import { schedule } from '@ember/runloop';

import { TimelineLite } from 'gsap';

export default Route.extend({
    myGroup: service('my-group'),
    activity: service(),

    model() {
        return this.activity.fetch();
    },

    activate() {
        schedule('afterRender', () => {
            const tline = new TimelineLite({ delay: 0.2 });

            tline.staggerFrom(
                '.activity-list-item',
                0.3,
                {
                    opacity: 0,
                    y: 10,
                },
                0.03
            );
        });
    },
});
