import DS from 'ember-data';
import Validator from '../../mixins/model-validator';
import { computed } from '@ember/object';
import { inject as service } from '@ember/service';
import firebase from 'firebase';

export default DS.Model.extend(Validator, {
    session: service(),

    name: DS.attr('string'),
    password: DS.attr('string'),
    email: DS.attr('string'),
    group: DS.attr('string'),

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
        group: {
            presence: true,
        },
    })),

    signUp() {
        return firebase
            .auth()
            .createUserWithEmailAndPassword(this.get('email'), this.get('password'))
            .then(newUser =>
                // this is needed to have user model on screen
                // rest of model is filled on server
                firebase
                    .database()
                    .ref('/users/' + newUser.uid)
                    .set({
                        name: this.name,
                        created: Date.now(),
                    })
            );
    },
});
