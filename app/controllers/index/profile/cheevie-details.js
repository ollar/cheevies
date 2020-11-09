import Controller from '@ember/controller';
import { action } from '@ember/object';
import { inject as service } from '@ember/service';
import { getOwner } from '@ember/application';


export default class IndexProfileCheevieDetailsController extends Controller {
    @service share;
    @service intl;
    @service me;
    @service activity;

    get profileController() {
        return getOwner(this).lookup('controller:index.profile');
    }

    get userId() {
        return this.profileController.model.id;
    }

    get myId() {
        return this.me.model.id;
    }

    get isMe() {
        return this.userId === this.myId;
    }

    get isShareAvailable() {
        return this.share.isAvailable;
    }

    get image() {
        return this.model.get('image-set.512');
    }

    @action
    goBack() {
        window.history.back();
    }

    @action
    shareCheevie(cheevie) {
        const onSuccess = () => {
            return this.send('notify', {
                type: 'success',
                text: this.intl.t('share.messages.success'),
            });
        };

        const onError = () => {
            return this.send('notify', {
                type: 'error',
                text: this.intl.t('share.messages.error'),
            });
        };

        this.share
            .post({
                title: this.intl.t('share.cheevie.title'),
                text: this.intl.t('share.cheevie.text', { cheevie: cheevie.name }),
                url: `${this.share.appDomain}/profile/${this.model.id}`,
            })
            .then(() => onSuccess(), () => onError());
    }

    @action
    refuseCheevie(cheevie) {
        const model = this.profileController.model;
        model.get('cheevies').removeObject(cheevie);
        model.save().then(() => {
            this.activity.send({
                cheevie,
                action: 'refuseCheevie',
            });

            this.goBack();
        });
    }
}
