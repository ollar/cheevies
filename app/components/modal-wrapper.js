import Component from '@ember/component';
import BusyMixin from '../mixins/busy-loader';

import { TweenLite } from 'gsap';
import { Power4 } from 'gsap/easing';

export default Component.extend(BusyMixin, {
    classNames: ['modal'],

    animationDuration: 0.3,

    didInsertElement() {
        this._super(...arguments);

        if (this.giveCheevieModal) {
            TweenLite.from('.modal-content', this.animationDuration * 2, {
                y: '100%',
                opacity: 0,
                ease: Power4.easeOut,
            });
        } else {
            TweenLite.from('.modal-content', this.animationDuration, {
                y: 20,
                opacity: 0,
                ease: Power4.easeOut,
            });
        }
        TweenLite.from('.modal-background,.modal-close', this.animationDuration, {
            opacity: 0,
        });
    },

    actions: {
        goBack() {
            const onComplete = () => {
                if (this.goBack && this.goBack.call) this.goBack();
            };
            if (this.giveCheevieModal) {
                TweenLite.to('.modal-content', this.animationDuration * 2, {
                    y: '100%',
                    opacity: 0,
                    onComplete,
                    ease: Power4.easeIn,
                });
            } else {
                TweenLite.to('.modal-content', this.animationDuration, {
                    y: 20,
                    opacity: 0,
                    onComplete,
                    ease: Power4.easeOut,
                });
            }
            TweenLite.to('.modal-background,.modal-close', this.animationDuration, {
                opacity: 0,
            });
        },
    },
});
