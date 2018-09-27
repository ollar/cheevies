import Component from '@ember/component';
import DraggableMixin from '../mixins/draggable';

export default Component.extend(DraggableMixin, {
    panDirection() {
        return this.DIRECTION_HORIZONTAL;
    },

    onPanEnvComplete() {},
});
