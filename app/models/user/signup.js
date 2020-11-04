import Model, { attr } from '@ember-data/model';
import Validator from '../../mixins/model-validator';
import {
    computed
} from '@ember/object';
import {
    inject as service
} from '@ember/service';

export default Model.extend(Validator, {
    session: service(),

    name: attr('string'),
    password: attr('string'),
    email: attr('string'),

    init() {
        this._super(...arguments);
        this._createUserMode = this._createUserMode.bind(this);
    },

    validations: computed(() => ({
        name: {
            presence: true,
        },
        password: {
            presence: true,
            length: {
                minimum: 6,
            },
        },
        email: {
            presence: true,
            email: true,
        },
    })),

    _createUserMode({ user: newUser }) {
        // this is needed to have user model on screen
        return this.firebase
            .database()
            .then(database =>
                database.ref('/users/' + newUser.uid)
                .set({
                    name: this.name || newUser.displayName,
                    email: newUser.email,
                    created: Date.now(),
                })
            );
    },

    signUp() {
        return this.firebase
            .auth()
            .then(auth => auth.createUserWithEmailAndPassword(this.email, this.password))
            .then(this._createUserMode);
    },
});
