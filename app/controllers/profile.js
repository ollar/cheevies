import Controller from '@ember/controller';
import { inject as service } from '@ember/service';

export default class ProfileController extends Controller {
    @service me;
    @service myGroup;
    @service intl;
    @service share;
    @service activity;



    get userId() {
        return this.model.id;
    }

    get myId() {
        return this.me.model.id;
    }

    get isShareAvailable() {
        return this.share.isAvailable;
    }

    get _model() {
        return this.model;
    }

    _uploadPath(image) {
        return `users/${this.model.id}/${image.width}/${image.name}`;
    }

    get groupCheevies() {
        return this.myGroup.cheevies;
    }

    get userCheevies() {
        return this.model.cheevies;
    }

    get cheevies() {
        return []
    }
}
