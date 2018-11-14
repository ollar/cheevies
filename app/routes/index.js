import Route from '@ember/routing/route';
import { hash } from 'rsvp';
import AuthenticatedRouteMixin from '../mixins/authenticated-route-mixin';
import { inject as service } from '@ember/service';
import { computed } from '@ember/object';
import { later } from '@ember/runloop';

import getGroupCheevies from '../utils/get-group-cheevies';

export default Route.extend(AuthenticatedRouteMixin, {
    me: service(),
    settings: service(),
    myGroup: service('my-group'),
    cachedImage: service(),
    i18n: service(),

    settingsModel: computed.alias('settings.model'),

    model() {
        if (!this.get('myGroup.groupName')) return {};

        return this.myGroup
            .fetch()
            .then(group =>
                hash({
                    me: this.me.fetch(),
                    users: group.get('users'),
                    cheevies: getGroupCheevies(group),
                    settings: this.settings.fetch(),
                })
            )
            .catch(() => this.onModelError());
    },

    onModelError() {
        this.transitionTo('logout');
        this.send('notify', {
            type: 'error',
            text: this.i18n.t('messages.app_init_error'),
        });
    },

    afterModel() {
        const imageSets = this.store.peekAll('image-set');

        if (this.me.model) {
            hash({
                myGroup: this.myGroup.fetch(),
                me: this.me.fetch(),
            })
                .then(({ myGroup, me }) => ({
                    availableCheevies: getGroupCheevies(myGroup),
                    unseenCheevies: me.get('unseenCheevies'),
                }))
                .then(({ availableCheevies, unseenCheevies }) =>
                    unseenCheevies.filter(cheevie => availableCheevies.indexOf(cheevie) > -1)
                )
                .then(unseenCheevies => {
                    if (unseenCheevies.length) this.transitionTo('index.new-cheevies');
                });
        }

        later(
            () =>
                imageSets.forEach(_is =>
                    _is.eachRelationship(key =>
                        requestAnimationFrame(() =>
                            _is.get(key).then(image => this.cachedImage.getCachedSrc(image.url))
                        )
                    )
                ),
            3000
        );
    },
});
