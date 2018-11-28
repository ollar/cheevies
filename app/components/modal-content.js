import Component from '@ember/component';
import DraggableMixin from 'draggable-mixin/mixins/draggable';
export default Component.extend(DraggableMixin, {
    classNames: ['modal-content'],
    // classNameBindings: ['panAuto:pan-auto', 'disableDrag:pan-auto'],

    didInsertElement() {
        this._super(...arguments);
        this.elWrapper = this.element.parentElement;
        this.elWrapperOffsetHeight = this.elWrapper.offsetHeight;
        this.elementOffsetHeight = this.element.offsetHeight;
    },

    panDirection() {
        return this.DIRECTION_VERTICAL;
    },

    handlePanMove(ev) {
        const transformY = this.initialTransform[1];
        const moveY = transformY + ev.deltaY;

        // if modal content is bigger than wrapper
        if (this.elementOffsetHeight + 55 > this.elWrapperOffsetHeight) {
            if (
                this.giveCheevieModal &&
                this.elementOffsetHeight + moveY + 55 < this.elWrapperOffsetHeight
            )
                return ev;
        } else {
            if (this.giveCheevieModal && moveY < 0) return ev;
        }

        this._super(ev);
    },

    onPanEnvComplete() {
        this.elWrapper = this.element.parentElement;

        //remove it maybe
        if (this.disableDrag) return;

        const transformY = this.initialTransform[1];
        const moveY = transformY - this.previousMoveY;

        // pan down
        if (-transformY + moveY < 0) {
            if (Math.abs(-transformY + moveY) > 100) {
                this.goBack();
                return;
            }
        }

        if (this.giveCheevieModal) return;

        // pan up
        // if modal content is bigger than wrapper
        if (this.elementOffsetHeight + 55 > this.elWrapperOffsetHeight) {
            if (this.elementOffsetHeight - this.previousMoveY - this.elWrapperOffsetHeight > 200) {
                this.goBack();
                return;
            }
        } else {
            if (-transformY + moveY > 0) {
                if (Math.abs(-transformY + moveY) > 100) {
                    this.goBack();
                    return;
                }
            }
        }
    },
});
