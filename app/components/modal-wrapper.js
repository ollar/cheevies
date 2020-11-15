import Component from '@glimmer/component';
import { action } from '@ember/object';
import { tracked } from '@glimmer/tracking';

import { TweenLite } from 'gsap';
import { Power2 } from 'gsap/easing';


export default class ModalWrapperComponent extends Component {
    @tracked noTransition = false;

    animationDuration = 0.3;

    @action
    didInsert() {
        this.noTransition = true;

        const onComplete = () => {
            if (!this.isDestroyed || !this.isDestroying) this.noTransition = false;
        };

        if (this.args.giveCheevieModal) {
            TweenLite.from('.modal-content', this.animationDuration, {
                y: '100%',
                opacity: 0,
                ease: Power2.easeIn,
                onComplete,
            });
        } else {
            TweenLite.from('.modal-content', this.animationDuration, {
                y: 20,
                opacity: 0,
                ease: Power2.easeIn,
                onComplete,
            });
        }
        TweenLite.from('.modal-background,.modal-close', this.animationDuration, {
            opacity: 0,
        });
    }

    @action
    goBack() {
        this.noTransition = true;

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
            if (!this.isDestroyed || !this.isDestroying) {
                this.noTransition = false;
                if (this.args.goBack && this.args.goBack.call) this.args.goBack();
            }
        };
        if (this.args.giveCheevieModal) {
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
    }

}
