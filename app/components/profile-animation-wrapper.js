import Component from '@ember/component';
import { schedule, scheduleOnce } from '@ember/runloop';
import { observer } from '@ember/object';

import { TimelineLite } from 'gsap';

export default Component.extend({
    tagName: '',

    init() {
        this._super();
        this.tline = new TimelineLite({
            paused: true,
            onComplete() {
                document.querySelector('.cheevies').removeAttribute('style');
            },
        });
    },

    cheeviesLoaded: observer('_cheeviesPromise.length', function() {
        if (this._cheeviesPromise.isFulfilled)
            scheduleOnce('afterRender', () => {
                this._runAnimation();
            });
    }),

    _runAnimation() {
        schedule('afterRender', () => this.tline.play());
    },

    didInsertElement() {
        this.tline
            .from('.user-image', 0.2, { scale: 1.2, opacity: 0 })
            .from('.name', 0.1, { opacity: 0 })
            .from('.cheevies', 0.2, {
                scale: 0.8,
                opacity: 0,
            });

        if (this._cheeviesPromise.isFulfilled) this._runAnimation();
    },
});
