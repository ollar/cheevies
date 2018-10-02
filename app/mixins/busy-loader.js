import Mixin from '@ember/object/mixin';

export default Mixin.create({
    busy: false,
    classNameBindings: ['busy:is-busy'],

    setBusy(_busy = false) {
        this.set('busy', _busy);
    },
});
