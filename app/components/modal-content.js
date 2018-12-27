import Component from '@ember/component';
import DraggableMixin from 'draggable-mixin/mixins/draggable';
import { htmlSafe } from '@ember/string';

export default Component.extend(DraggableMixin, {
    classNames: ['modal-content'],
    threshold: 100,

    panDirection() {
        return this.DIRECTION_VERTICAL;
    },

    didInsertElement() {
        this.elWrapper = this.element.parentElement;
        const { marginTop } = window.getComputedStyle(this.element);
        this.set('marginTop', parseInt(marginTop));

        if (this.disableDrag) return;
        this._super(...arguments);
    },

    willDestroyElement() {
        if (this.disableDrag) return;
        this._super(...arguments);
    },

    handlePanStart() {
        this.elWrapperHeight = this.elWrapper.offsetHeight;
        this.elementHeight = this.element.offsetHeight;
        this._super(...arguments);
    },

    handlePanMove(ev) {
        const transformY = this.initialTransform[1];
        const moveY = transformY + ev.deltaY;

        // if modal content is bigger than wrapper
        if (this.elementHeight + this.marginTop > this.elWrapperHeight) {
            if (
                this.giveCheevieModal &&
                this.elementHeight + moveY + this.marginTop < this.elWrapperHeight
            )
                return ev;
        } else {
            if (this.giveCheevieModal && moveY < 0) return ev;
        }

        this._super(ev);
    },

    onPanEnvComplete() {
        //remove it maybe
        if (this.disableDrag) return;

        const transformY = this.initialTransform[1];
        const moveY = transformY - this.previousMoveY;
        const resultMoveY = -transformY + moveY;
        // const elRect = this.element.getBoundingClientRect();

        if (this.giveCheevieModal) {
            // Give cheevie modal ==============================================
            if (this.elementHeight + this.marginTop < this.elWrapperHeight) {
                // modal content is smaller than wrapper =======================
                if (Math.abs(resultMoveY) > this.threshold) {
                    return this.goBack();
                } else {
                    return this._super(...arguments);
                }
            } else {
                // modal content is bigger than wrapper ========================
                if (resultMoveY < 0) {
                    // pan down
                    if (Math.abs(resultMoveY) > this.threshold) {
                        return this.goBack();
                    } else {
                        return this._super(...arguments);
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
                    return this._super(...arguments);
                }
            } else {
                // modal content is bigger than wrapper ========================
                if (resultMoveY < 0) {
                    // pan down
                    if (Math.abs(resultMoveY) > this.threshold) {
                        return this.goBack();
                    } else {
                        return this._super(...arguments);
                    }
                } else {
                    // pan up
                    // let pannedY = this.elWrapperHeight + resultMoveY;
                    let elResultHeight = this.elementHeight + this.marginTop;
                    let bottomOffset = resultMoveY - elResultHeight + this.elWrapperHeight;
                    let bottomIsVisible = bottomOffset > 0;

                    if (bottomIsVisible && bottomOffset < this.threshold) {
                        return this.set(
                            'style',
                            htmlSafe(
                                `${this.cachedStyle} transform: translate(0px, ${-elResultHeight +
                                    this.elWrapperHeight -
                                    10}px)`
                            )
                        );
                    } else if (bottomIsVisible && bottomOffset > this.threshold) {
                        return this.goBack();
                    }
                }
            }
        }
    },
});
