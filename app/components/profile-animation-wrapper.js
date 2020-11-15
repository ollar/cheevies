import Component from '@ember/component';

import { TimelineLite } from 'gsap';

export default Component.extend({
    tagName: '',

    init() {
        this._super();
        this.tline = new TimelineLite({
            paused: true,
            onComplete() {
                const cheevies = document.querySelector('.cheevies');
                if (cheevies) cheevies.removeAttribute('style');
            },
        });
    },

    _runAnimation() {
        if (!this.tline.isActive()) this.tline.play();
    },

    didInsertElement() {
        this.tline
            .from('.user-image', 0.2, { scale: 1.2, opacity: 0 })
            .from('.name', 0.1, { opacity: 0 })
            .from('.cheevies', 0.2, {
                scale: 0.8,
                opacity: 0,
            });

        this._runAnimation();
    },
});
