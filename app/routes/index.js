import Route from '@ember/routing/route';
import { hash } from 'rsvp';
import AuthenticatedRouteMixin from '../mixins/authenticated-route-mixin';
import { inject as service } from '@ember/service';
import { computed } from '@ember/object';

export default Route.extend(AuthenticatedRouteMixin, {
    me: service(),
    settings: service(),
    myGroup: service('my-group'),
    firebaseApp: service(),

    settingsModel: computed.alias('settings.model'),

    model() {
        if (!this.get('myGroup.groupName')) return {};

        return this.myGroup.fetch().then(group =>
            hash({
                me: this.me.fetch(),
                users: group.get('users'),
                cheevies: group.get('cheevies'),
                settings: this.settings.fetch(),
            })
        );
    },

    afterModel() {
        const imageSets = this.store.peekAll('image-set');
        imageSets.forEach(_is =>
            _is.eachRelationship(key => requestAnimationFrame(() => _is.get(key)))
        );

        const messaging = this.get('firebaseApp').messaging();
        const _this = this;

        // TODO: consider remove it from here
        if (0 && this.get('me.model') && this.settingsModel.get('pushNotifications')) {
            messaging
                .requestPermission()
                .then(() => messaging.getToken())
                .then(token => {
                    this.get('me.model').set('fcmToken', token);
                    this.get('me.model').save();
                    this.settingsModel.set('pushNotifications', true);
                    return this.settings.save();
                })
                .catch(err => {
                    this.settingsModel.set('pushNotifications', false);
                    return this.settings.save().then(() =>
                        this.send('notify', {
                            type: 'error',
                            text: err.toString(),
                        })
                    );
                });
        }

        messaging.onMessage(payload => {
            _this.send('notify', {
                type: 'info',
                text: payload.notification.body,
            });
        });
    },
});
