import Controller from '@ember/controller';
import { schedule } from '@ember/runloop';
import { inject as service } from '@ember/service';
import { computed } from '@ember/object';
import { resolve } from 'rsvp';

export default Controller.extend({
  me: service(),
  session: service(),

  myModel: computed('session.isAuthenticated', function() {
    return this.me.model;
  }),

  init() {
    this._super(...arguments);

    this.onSuccess = this.onSuccess.bind(this);
    this.onError = this.onError.bind(this);
    this.onRegisterSuccess = this.onRegisterSuccess.bind(this);
  },

  onRegisterSuccess() {
    return this.me.fetch().then(() => {
      this.myModel.set('name', this.model.name);
      return this.myModel.save();
    });
  },

  onSuccess() {
    return resolve()
      .then(() =>
        this.send('notify', {
          type: 'success',
          text: this.get('i18n').t('signup.success_message'),
        })
      )
      .then(() => {
        schedule('routerTransitions', () => this.transitionToRoute('index'));
      });
  },

  onError(err) {
    return this.send('notify', {
      type: 'error',
      text: err.message,
    });
  },

  actions: {
    handleRegister() {
      if (this.model.validate({ except: ['group'] })) {
        this.model
          .signUp()
          .then(() =>
            this.session.authenticate('authenticator:firebase', {
              email: this.get('model.email'),
              password: this.get('model.password'),
            })
          )
          .then(this.onRegisterSuccess, this.onError);
      }
    },

    selectGroup() {
      if (this.model.validate({ except: ['name', 'password', 'email'] })) {
        return this.store
          .query('group', {
            orderBy: 'name',
            equalTo: this.model.group,
          })
          .then(groups => {
            var group =
              groups.length > 0
                ? // group exists
                  groups.firstObject
                : // group not exists
                  this.store.createRecord({ name: this.model.group });

            group.get('users').addObject(this.myModel);
            this.myModel.get('groups').addObject(group);
            group.save();
            this.myModel.save();

            this.get('session').set('data.group', group.name);
            return true;
          })
          .then(this.onSuccess, this.onError);
      }
    },

    invalidate() {
      return this.get('session').invalidate();
    },
  },
});
