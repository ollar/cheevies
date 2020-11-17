import Controller from '@ember/controller';
import { inject as service } from '@ember/service';
import { action } from '@ember/object';
import { schedule } from '@ember/runloop';
import { all } from 'rsvp';


export default class WardrobeSelectGroupController extends Controller {
    @service me;
    @service session;
    @service intl;

    get myModel() {
        return this.me.model;
    }

    get imageSet() {
        return this.myModel['image-set'];
    }

    get myImage() {
        if (!this.get('imageSet.64')) return null;
        return {
            sm: this.get('imageSet.64'),
            md: this.get('imageSet.128'),
            lg: this.get('imageSet.256'),
        };
    }

    @action
    onSuccess() {
        return Promise.resolve()
            .then(() =>
                this.send('notify', {
                    type: 'info',
                    text: this.intl.t('messages.welcome_default'),
                })
            )
            .then(() => this.transitionToRoute('index'));
    }

    @action
    onError(err) {
        this.send('notify', {
            type: 'error',
            text: err.message,
        });
    }

    @action
    async selectGroup() {
        if (this.model.validate()) {
            try {
                await this.me.fetch();

                const groups = await this.store
                        .query('group', {
                            find: {
                                name: this.model.group
                                    .toLowerCase() // todo: check this
                                    .trim()
                            }
                        });

                if (!groups || groups.length === 0) {
                    throw new Error(this.intl.t('login.messages.no_such_group'));
                }

                const group = groups.firstObject;
                const users = group.users.toArray().map(u => u.id);

                // no user in group
                if (!users.includes(this.me.model.id)) {
                    // Group is locked -> show error
                    if (group.locked) {
                        throw new Error(
                            this.intl.t('login.messages.group_is_locked')
                        );
                    }

                    // Group is public -> pass
                    group.users.pushObject(this.me.model);
                    this.me.model.groups.pushObject(group);
                    await all([ group.save(), this.me.model.save() ]);
                }

                this.session.persist('group', group.name)

                return group.reload().then(this.onSuccess);
            } catch (error) {
                this.onError(error);
            }
        }
    }

    @action
    invalidate() {
        return this.session
            .invalidate()
            .then(() => this.transitionToRoute('index'));
    }
}
