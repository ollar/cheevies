import Component from '@ember/component';
import DraggableMixin from '../mixins/draggable';

export default Component.extend(DraggableMixin, {
    panDirection() {
        return this.DIRECTION_HORIZONTAL;
    },

    onPanEnvComplete() {
        this._super();

        const moveX = Math.abs(this.initialTransform[0]) - Math.abs(this.previousMoveX);

        if (moveX < 0) {
            this.setActivePage('cheevies');
        } else {
            this.setActivePage('users');
        }
    },
});
