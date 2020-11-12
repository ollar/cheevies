import Component from '@glimmer/component';
import { inject as service } from '@ember/service';
import { readOnly } from '@ember/object/computed';
import { action } from '@ember/object';

import { userIsModerator, userIsGroupAuthor } from '../utils/user-role';


export default class SiteDrawerAsideComponent extends Component {
    @service me;
    @service myGroup;
    @service router;

    @readOnly('me.model') myModel;
    @readOnly('myGroup.model') groupModel;

    get imageSet() {
        if (!this.me.model) return null;
        return this.me.model.get('image-set');
    }

    // todo fix this
    get image() {
        if (!this.imageSet) return null;
        if (!this.imageSet.get('128')) return null;
        return {
            sm: this.imageSet.get('256'),
            md: this.imageSet.get('512'),
        };
    }

    get canCreateCheevie() {
        if (!this.myModel || !this.groupModel) return false;
        return (
            this.groupModel.policy === 'anarchy' ||
            userIsModerator(this.groupModel, this.myModel) ||
            userIsGroupAuthor(this.groupModel, this.myModel)
        );
    }

    get cheevies() {
        if (!this.myModel || !this.groupModel) return [];
        const userCheevies = this.myModel.cheevies;
        const groupCheevies = this.groupModel.cheevies;

        return userCheevies.filter(cheevie => groupCheevies.includes(cheevie));
    }

    @action
    createCheevie() {
        this.router.transitionTo('index.index.create-cheevie');
    }

    @action
    invalidate() {
        return this.router.transitionTo('wardrobe.sign-out');
    }
}
