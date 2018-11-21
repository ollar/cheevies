import Component from '@ember/component';
import BusyMixin from '../mixins/busy-loader';

import { TweenLite } from 'gsap';
import { Power2 } from 'gsap/easing';

export default Component.extend(BusyMixin, {
    classNames: ['modal'],

    animationDuration: 0.3,

    didInsertElement() {
        this._super(...arguments);

        if (this.giveCheevieModal) {
            TweenLite.from('.modal-content', this.animationDuration, {
                y: '100%',
                opacity: 0,
                ease: Power2.easeOut,
            });
        } else {
            TweenLite.from('.modal-content', this.animationDuration, {
                y: 20,
                opacity: 0,
                ease: Power2.easeOut,
            });
        }
        TweenLite.from('.modal-background,.modal-close', this.animationDuration, {
            opacity: 0,
        });
    },

    actions: {
        goBack() {
            const elY = () => {
                var y = 0;

                return element => {
                    if (!y) {
                        y = window
                            .getComputedStyle(element)
                            .transform.replace(/[a-z()]/g, '')
                            .split(', ')
                            .slice(-1)[0];
                    }
                    return y;
                };
            };

            const Y = elY();
            const onComplete = () => {
                if (this.goBack && this.goBack.call) this.goBack();
            };
            if (this.giveCheevieModal) {
                TweenLite.fromTo(
                    '.modal-content',
                    this.animationDuration,
                    {
                        y: (index, element) => Y(element),
                        opacity: 1,
                    },
                    {
                        y: '100%',
                        opacity: 0,
                        onComplete,
                        ease: Power2.easeIn,
                    }
                );
            } else {
                TweenLite.fromTo(
                    '.modal-content',
                    this.animationDuration / 2,
                    {
                        y: (index, element) => Y(element),
                        opacity: 1,
                    },
                    {
                        y: '+=20',
                        opacity: 0,
                        onComplete,
                        ease: Power2.easeIn,
                    }
                );
            }
            TweenLite.to('.modal-background,.modal-close', this.animationDuration, {
                opacity: 0,
            });
        },
    },
});
