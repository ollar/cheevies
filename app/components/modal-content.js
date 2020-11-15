import Component from '@glimmer/component';
import { action } from '@ember/object';
import { htmlSafe } from '@ember/string';

import { DIRECTION_VERTICAL } from 'draggable-modifier';

export default class ModalContentComponent extends Component {
    threshold = 200;
    panDirection = DIRECTION_VERTICAL;
    marginTop = 0;
    elWrapperHeight = 0;
    elementHeight = 0;
    elWrapper = null;
    element = null;

    @action
    didInsert(element) {
        this.elWrapper = element.parentElement;
        this.element = element;
        const { marginTop } = window.getComputedStyle(element);

        this.marginTop = parseInt(marginTop);

        // if (this.disableDrag) return;
    }


    @action
    handlePanStart(ev, cb) {
        this.elWrapperHeight = this.elWrapper.offsetHeight;
        this.elementHeight = this.element.offsetHeight;
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
                    return this.args.goBack();
                } else {
                    return cb(ev);
                }
            } else {
                // modal content is bigger than wrapper ========================
                if (resultMoveY < 0) {
                    // pan down
                    if (Math.abs(resultMoveY) > this.threshold) {
                        return this.args.goBack();
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
                    return this.args.goBack();
                } else {
                    return cb(ev);
                }
            } else {
                // modal content is bigger than wrapper ========================
                if (resultMoveY < 0) {
                    // pan down
                    if (Math.abs(resultMoveY) > this.threshold) {
                        return this.args.goBack();
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
                        return this.args.goBack();
                    }
                }
            }
        }
    }
}
