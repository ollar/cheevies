import Component from '@glimmer/component';
import { action } from '@ember/object';
import { DIRECTION_HORIZONTAL } from 'draggable-modifier';

export default class IndexSectionsWrapperComponent extends Component {
    panDirection = DIRECTION_HORIZONTAL;

    @action
    onPanEnvComplete(ev, cb, draggable) {
        const moveX = draggable.initialTransform[0] - draggable.previousMoveX;

        if (Math.abs(moveX) > 50) {
            if (moveX > 0) {
                this.args.setActivePage('cheevies');
            } else {
                this.args.setActivePage('users');
            }
        }

        return cb(...arguments);
    }
}
