import Controller from '@ember/controller';
import { action } from '@ember/object';
import { inject as service } from '@ember/service';


export default class IndexProfileCheevieDetailsController extends Controller {
    @service share;
    @service intl;

    get userId() {
        return this.model.id;
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
}
