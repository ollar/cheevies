import { modifier } from 'ember-modifier';

export default modifier(function busyLoader(element, [busy]) {
    if (busy) {
        element.classList.add('is-busy');
    } else {
        element.classList.remove('is-busy');
    }

    return () => element.classList.remove('is-busy');
});
