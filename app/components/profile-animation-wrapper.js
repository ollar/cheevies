import Component from '@ember/component';
import { schedule, scheduleOnce } from '@ember/runloop';
import { observer } from '@ember/object';

import { TimelineLite } from 'gsap';

export default Component.extend({
    tagName: '',

    init() {
        this._super();
        this.tline = new TimelineLite();
    },

    cheeviesLoaded: observer('_cheeviesPromise.length', function() {
        if (this._cheeviesPromise.isFulfilled)
            scheduleOnce('afterRender', () => {
                this._runAnimation();
            });
    }),

    _runAnimation() {
        schedule('afterRender', () => {
            var $iconImage = document.querySelector('.user-image');
            var $name = document.querySelector('.name');
            var $cheevies = document.querySelectorAll('.cheevie-wrapper');

            $iconImage.style.scale = '';
            $iconImage.style.opacity = '';
            $name.style.opacity = '';

            this.tline
                .from($iconImage, 0.3, { scale: 1.2, opacity: 0 })
                .from($name, 0.3, { opacity: 0 })
                .staggerFromTo(
                    $cheevies,
                    0.3,
                    {
                        scale: 0,
                        opacity: 0,
                    },
                    {
                        scale: 1,
                        opacity: 1,
                    },
                    0.016
                );
        });
    },

    didInsertElement() {
        var $iconImage = document.querySelector('.user-image');
        var $name = document.querySelector('.name');

        $iconImage.style.opacity = 0;
        $iconImage.style.scale = 1.2;
        $name.style.opacity = 0;

        if (this._cheeviesPromise.isFulfilled) this._runAnimation();
    },
});
