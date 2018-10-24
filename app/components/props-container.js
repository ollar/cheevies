import Component from '@ember/component';

import { TimelineLite } from 'gsap';
import { Power4 } from 'gsap/easing';

export default Component.extend({
    init() {
        this._super(...arguments);
        this.tline = new TimelineLite();
    },
    shuffleProps() {
        const height = document.body.scrollHeight;
        const width = document.body.scrollWidth;

        this.tline
            .from('.title', 0.3, {
                scale: 1.2,
            })
            .staggerFrom(
                '.cards-view',
                0.5,
                {
                    opacity: 0,
                    x: 100,
                    ease: Power4.easeIn,
                },
                0.1
            )
            .staggerFromTo(
                'svg',
                1,
                {
                    opacity: 0,
                    transform: () =>
                        `translate(${Math.random() * width}px, -${Math.random() * height}px)`,
                },
                {
                    opacity: 1,
                    transform: () =>
                        `translate(${Math.random() * width}px, -${Math.random() * height}px)`,
                },
                1
            )
            .staggerTo(
                'svg',
                1,
                {
                    opacity: 0,
                },
                0.3
            );
    },

    didInsertElement() {
        this._super(...arguments);

        this.shuffleProps();
    },

    willDestroyElement() {
        this._super(...arguments);
        this.tline.kill();
    },
});
