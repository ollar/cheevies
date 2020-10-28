import { alias } from '@ember/object/computed';
import Controller from '@ember/controller';
import { inject as service } from '@ember/service';
import { computed } from '@ember/object';
import { resolve, all } from 'rsvp';
import { schedule } from '@ember/runloop';

export default Controller.extend({
    session: service(),
    intl: service(),
    me: service(),

    myModel: alias('me.model'),

    onSuccess() {
        return resolve()
            .then(() =>
                this.send('notify', {
                    type: 'success',
                    text: this.intl.t('create_group.success_message'),
                })
            )
            .then(() => {
                schedule('routerTransitions', () => this.transitionToRoute('index'));
            });
    },

    onError(e) {
        return this.send('notify', {
            type: 'error',
            text: e.message || this.intl.t('create_group.error_message'),
        });
    },

    actions: {
        createGroup() {
            if (this.model.validate()) {
                this.me.fetch().then(() =>
                    this.store
                        .query('group', {
                            orderBy: 'name',
                            equalTo: this.model.name,
                        })
                        .then(groups => {
                            if (groups && groups.length) {
                                return this.send('notify', {
                                    type: 'error',
                                    text: this.intl.t('messages.group_already_exist'),
                                });
                            }
                            const newGroup = this.store.createRecord('group', {
                                name: this.model.name,
                            });

                            newGroup.get('users').addObject(this.myModel);
                            this.myModel.get('groups').addObject(newGroup);

                            newGroup.set('author', this.myModel);
                            newGroup.get('moderators').addObject(this.myModel);

                            this.get('session').set('data.group', newGroup.name);
                            return all([newGroup.save(), this.myModel.save()]).then(
                                () => this.onSuccess(),
                                e => this.onError(e)
                            );
                        })
                );
            }
        },

        cancel() {
            return window.history.back();
        },
    },
});
