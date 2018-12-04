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
        this._super(...arguments);
        this.elWrapper = this.element.parentElement;
        const { marginTop } = window.getComputedStyle(this.element);
        this.set('marginTop', parseInt(marginTop));
    },

    handlePanStart() {
        this.elWrapperOffsetHeight = this.elWrapper.offsetHeight;
        this.elementOffsetHeight = this.element.offsetHeight;
        this._super(...arguments);
    },

    handlePanMove(ev) {
        const transformY = this.initialTransform[1];
        const moveY = transformY + ev.deltaY;

        // if modal content is bigger than wrapper
        if (this.elementOffsetHeight + this.marginTop > this.elWrapperOffsetHeight) {
            if (
                this.giveCheevieModal &&
                this.elementOffsetHeight + moveY + this.marginTop < this.elWrapperOffsetHeight
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

        if (this.giveCheevieModal) {
            // Give cheevie modal ==============================================
            if (this.elementOffsetHeight + this.marginTop < this.elWrapperOffsetHeight) {
                // modal content is smaller than wrapper =======================
                if (Math.abs(-transformY + moveY) > this.threshold) {
                    return this.goBack();
                } else {
                    return this._super(...arguments);
                }
            } else {
                // modal content is bigger than wrapper ========================
                if (-transformY + moveY < 0) {
                    // pan down
                    if (Math.abs(-transformY + moveY) > this.threshold) {
                        return this.goBack();
                    } else {
                        return this._super(...arguments);
                    }
                }
            }
        } else {
            // Usual modal =====================================================
            if (this.elementOffsetHeight + this.marginTop < this.elWrapperOffsetHeight) {
                // modal content is smaller than wrapper =======================
                if (Math.abs(-transformY + moveY) > this.threshold) {
                    return this.goBack();
                } else {
                    return this._super(...arguments);
                }
            } else {
                // modal content is bigger than wrapper ========================
                if (-transformY + moveY < 0) {
                    // pan down
                    if (Math.abs(-transformY + moveY) > this.threshold) {
                        return this.goBack();
                    } else {
                        return this._super(...arguments);
                    }
                } else {
                    // pan up
                    let pannedY = this.elementOffsetHeight - transformY + moveY;
                    let bottomIsVisible = pannedY > this.elWrapperOffsetHeight;

                    if (bottomIsVisible && pannedY < this.elWrapperOffsetHeight + this.threshold) {
                        return this.set(
                            'style',
                            htmlSafe(
                                `${this.cachedStyle} transform: translate(0px, ${this
                                    .elWrapperOffsetHeight -
                                    this.elementOffsetHeight -
                                    this.marginTop -
                                    10}px)`
                            )
                        );
                    } else if (
                        bottomIsVisible &&
                        pannedY > this.elWrapperOffsetHeight + this.threshold
                    ) {
                        return this.goBack();
                    }
                }
            }
        }
    },
});
