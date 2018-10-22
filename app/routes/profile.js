import Route from '@ember/routing/route';
import { schedule } from '@ember/runloop';

import { TimelineLite } from 'gsap';

export default Route.extend({
    activate() {
        const tline = new TimelineLite();
        schedule('afterRender', () => {
            var $iconImage = document.querySelector('.user-image');
            var $title = document.querySelector('.name');
            var $cheevies = document.querySelectorAll('.cheevie-wrapper');

            tline
                .from($iconImage, 0.3, { scale: 1.2 })
                .from($title, 0.3, { opacity: 0 })
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
                    0.02
                );
        });
    },

    userHasEnteredData() {
        return Object.keys(this.get('controller.model').changedAttributes()).length > 0;
    },

    actions: {
        willTransition() {
            if (this.userHasEnteredData()) {
                this.get('controller.model').save();
            }
            return true;
        },
    },
});
