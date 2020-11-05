import Controller from '@ember/controller';
import { action } from '@ember/object';
import { inject as service } from '@ember/service';
import { schedule } from '@ember/runloop';


export default class CreateGroupController extends Controller {
    @service session;
    @service intl;
    @service me;

    get myModel() {
        return this.me.model;
    }

    @action
    async createGroup() {
        if (this.model.validate()) {
            await this.me.fetch();

            const groups = await this.store.query('group', { find: { name: this.model.name } });

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
            newGroup.set('author', this.myModel);
            newGroup.get('moderators').addObject(this.myModel);

            await newGroup.save();

            this.myModel.get('groups').addObject(newGroup);
            this.session.set('data.group', newGroup.name);

            return this.myModel.save().then(this.onSuccess, this.onError);
        }
    }

    @action
    cancel() {
        return window.history.back();
    }


    @action
    onSuccess() {
        return Promise.resolve()
            .then(() =>
                this.send('notify', {
                    type: 'success',
                    text: this.intl.t('create_group.success_message'),
                })
            )
            .then(() => {
                schedule('routerTransitions', () => this.transitionToRoute('index'));
            });
    }

    @action
    onError(e) {
        return this.send('notify', {
            type: 'error',
            text: e.message || this.intl.t('create_group.error_message'),
        });
    }
}
