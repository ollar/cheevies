import Component from '@ember/component';
import DraggableMixin from 'draggable-mixin/mixins/draggable';

export default Component.extend(DraggableMixin, {
    classNames: ['modal-content'],
    classNameBindings: ['panX:pan-x'],

    panDirection() {
        return this.DIRECTION_VERTICAL;
    },

    handlePanStart(ev) {
        const elWrapper = this.element.parentElement;
        if (elWrapper.scrollTop === 0 && ev.direction === this.DIRECTION_DOWN) {
            this.set('panX', true);
        } else {
            this.set('panX', false);
        }
        this._super(...arguments);
    },

    handlePanMove(ev) {
        if (this.disableDrag) return ev;
        if (this.giveCheevieModal && ev.deltaY < 0) return ev;
        this._super(ev);
    },

    onPanEnvComplete() {
        if (this.disableDrag) return;
        const moveY = this.initialTransform[1] - this.previousMoveY;
        if (Math.abs(moveY) > 100) {
            this.goBack();
            return;
        }

        this._super(...arguments);
    },
});
