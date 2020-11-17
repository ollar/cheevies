import Component from '@glimmer/component';
import { action } from '@ember/object';
import { tracked } from '@glimmer/tracking';
import { schedule, later } from '@ember/runloop';
import { htmlSafe } from '@ember/string';


import { DIRECTION_VERTICAL } from 'draggable-modifier';


export default class ModalComponent extends Component {
    closeButtonComponent = 'modal/close-button';
    contentComponent = 'modal/content';
    overlayComponent = 'modal/overlay';

    animationDuration = 200;
    threshold = 200;
    panDirection = DIRECTION_VERTICAL;

    @tracked wrapperElement = null;
    @tracked contentElement = null;
    @tracked closeElement = null;
    @tracked overlayElement = null;


    @action
    didInsert(element) {
        this.wrapperElement = element;
    }

    @action
    contentDidInsert(element) {
        this.closeElement.style.opacity = 0;
        this.overlayElement.style.opacity = 0;

        if (this.args.giveCheevieModal) {
            element.style.transform = 'translate(0, 100%)';
        } else {
            element.style.opacity = 0;
            element.style.transform = 'translate(0, 20px)';
        }

        schedule('afterRender', () => {
            element.style.opacity = 1;
            element.style.transform = '';
            this.closeElement.style.opacity = 1;
            this.overlayElement.style.opacity = 1;
        });

        const { marginTop } = window.getComputedStyle(element);

        this.marginTop = parseInt(marginTop);
    }

    @action
    saveCloseRef(element) {
        this.closeElement = element;
    }

    @action
    saveOverlayRef(element) {
        this.overlayElement = element;
    }

    @action
    saveContentRef(element) {
        this.contentElement = element;
    }

    @action
    handlePanStart(ev, cb) {
        this.elWrapperHeight = this.wrapperElement.offsetHeight;
        this.elementHeight = this.contentElement.offsetHeight;
        return cb(ev);
    }

    @action
    handlePanMove(ev, cb, draggable) {
        const transformY = draggable.initialTransform[1];
        const moveY = transformY + ev.deltaY;

        // if modal content is bigger than wrapper
        if (this.elementHeight + this.marginTop > this.elWrapperHeight) {
            if (
                this.args.giveCheevieModal &&
                this.elementHeight + moveY + this.marginTop < this.elWrapperHeight
            )
                return false;
        } else {
            if (this.args.giveCheevieModal && moveY < 0) return false;
        }

        return cb(ev);
    }

    @action
    onPanEnvComplete(ev, cb, draggable) {
        //remove it maybe
        if (this.args.disableDrag) return;

        const transformY = draggable.initialTransform[1];
        const moveY = transformY - draggable.previousMoveY;
        const resultMoveY = -transformY + moveY;
        // const elRect = this.element.getBoundingClientRect();

        if (this.giveCheevieModal) {
            // Give cheevie modal ==============================================
            if (this.elementHeight + this.marginTop < this.elWrapperHeight) {
                // modal content is smaller than wrapper =======================
                if (Math.abs(resultMoveY) > this.threshold) {
                    return this.goBack();
                } else {
                    return cb(ev);
                }
            } else {
                // modal content is bigger than wrapper ========================
                if (resultMoveY < 0) {
                    // pan down
                    if (Math.abs(resultMoveY) > this.threshold) {
                        return this.goBack();
                    } else {
                        return cb(ev);
                    }
                }
            }
        } else {
            // Usual modal =====================================================
            if (this.elementHeight + this.marginTop < this.elWrapperHeight) {
                // modal content is smaller than wrapper =======================
                if (Math.abs(resultMoveY) > this.threshold) {
                    return this.goBack();
                } else {
                    return cb(ev);
                }
            } else {
                // modal content is bigger than wrapper ========================
                if (resultMoveY < 0) {
                    // pan down
                    if (Math.abs(resultMoveY) > this.threshold) {
                        return this.goBack();
                    } else {
                        return cb(ev);
                    }
                } else {
                    // pan up
                    // let pannedY = this.elWrapperHeight + resultMoveY;
                    let elResultHeight = this.elementHeight + this.marginTop;
                    let bottomOffset = resultMoveY - elResultHeight + this.elWrapperHeight;
                    let bottomIsVisible = bottomOffset > 0;

                    if (bottomIsVisible && bottomOffset < this.threshold) {
                        return draggable.element.style =
                            htmlSafe(
                                `${draggable.cachedStyle} transform: translate(0px, ${-elResultHeight +
                                    this.elWrapperHeight -
                                    10}px)`
                            );
                    } else if (bottomIsVisible && bottomOffset > this.threshold) {
                        return this.goBack();
                    }
                }
            }
        }
    }

    @action
    goBack() {
        if (this.args.giveCheevieModal) {
            this.contentElement.style.transform = 'translate(0, 100%)';
        } else {
            let y = this.contentElement.style.transform;
            y = parseInt(y.split(', ')[1]);
            this.contentElement.style.transform = `translate(0, ${y + 20}px)`;
            this.contentElement.style.opacity = 0;
        }
        this.closeElement.style.opacity = 0;
        this.overlayElement.style.opacity = 0;

        later(() => {
            if (!this.isDestroyed || !this.isDestroying) {
                this.noTransition = false;
                if (this.args.goBack && this.args.goBack.call) this.args.goBack();
            }
        }, this.animationDuration);

        return;
    }
}
