import Component from '@ember/component';
import BusyMixin from '../mixins/busy-loader';

import { TweenLite } from 'gsap';
import { Power4 } from 'gsap/easing';

export default Component.extend(BusyMixin, {
    classNames: ['modal'],

    animationDuration: 0.3,

    didInsertElement() {
        this._super(...arguments);

        TweenLite.from('.modal-content', this.animationDuration, {
            y: 20,
            opacity: 0,
            ease: Power4.easeOut,
        });
        TweenLite.from('.modal-background,.modal-close', this.animationDuration, {
            opacity: 0,
        });
    },

    actions: {
        goBack() {
            TweenLite.to('.modal-content', this.animationDuration, {
                y: 20,
                opacity: 0,
                onComplete: () => {
                    if (this.goBack && this.goBack.call) this.goBack();
                },
                ease: Power4.easeOut,
            });
            TweenLite.to('.modal-background,.modal-close', this.animationDuration, {
                opacity: 0,
            });
        },
    },
});
