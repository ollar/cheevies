import DS from 'ember-data';
import Validator from '../../mixins/model-validator';
import { computed } from '@ember/object';
import { inject as service } from '@ember/service';

export default DS.Model.extend(Validator, {
  session: service(),

  name: DS.attr('string'),
  password: DS.attr('string'),
  email: DS.attr('string'),

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

  signUp() {
    return this.get('session')
      .register(this.get('email'), this.get('password'))
      .then(() =>
        this.get('session').open('firebase', {
          provider: 'password',
          email: this.get('email'),
          password: this.get('password'),
        })
      );
  },
});
