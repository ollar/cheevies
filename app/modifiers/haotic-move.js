import { modifier } from 'ember-modifier';
import { schedule } from '@ember/runloop';

const max = 10;
const min = -10;

export default modifier(function haoticMove(element/*, params, hash*/) {
    function _getMove() {
        return Math.floor(Math.random() * (max - min + 1)) + min;
    }

    const x = _getMove();
    const y = _getMove();

    schedule('afterRender', () => {
        element.style.transform = `translate(${x}px, ${y}px)`;
    });
});
