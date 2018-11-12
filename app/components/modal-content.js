import Component from '@ember/component';
import DraggableMixin from 'draggable-mixin/mixins/draggable';

export default Component.extend(DraggableMixin, {
    classNames: ['modal-content'],

    panDirection() {
        return this.DIRECTION_VERTICAL;
    },

    handlePanMove(ev) {
        if (this.giveCheevieModal && ev.deltaY < 0) return;
        this._super(ev);
    },

    onPanEnvComplete() {
        const moveY = this.initialTransform[1] - this.previousMoveY;
        if (Math.abs(moveY) > 50) {
            this.goBack();
        }

        this._super(...arguments);
    },
});
