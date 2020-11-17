import Controller from '@ember/controller';
import { inject as service } from '@ember/service';
import { action } from '@ember/object';
import { tracked } from '@glimmer/tracking';
import { later } from '@ember/runloop';


export default class ProfileController extends Controller {
    @service activity;
    @service me;
    @service myGroup;

    @tracked busy = false;

    get cheevies() {
        return this.myGroup.cheevies.filter(cheevie => !this.model.cheevies.includes(cheevie));
    }

    get userId() {
        return this.model.id;
    }

    get myId() {
        return this.me.model.id;
    }

    get isMe() {
        return this.userId === this.myId;
    }

    @action
    goBack() {
        return window.history.back();
    }

    @action
    pickCheevie(cheevie, e) {
        let _this = this;
        this.busy = true;
        let $cheevie = e.currentTarget;

        $cheevie.style.transition = '0.2s';

        later(() => {
            $cheevie.style.transform = 'translate(0, -100px)';
            $cheevie.style.opacity = 0;
            later(() => {
                const user = _this.model;
                user.get('cheevies').pushObject(cheevie);
                user.get('unseenCheevies').pushObject(cheevie);
                user.save().then(() => {
                    _this.busy = false;
                    _this.activity.send({
                        cheevie,
                        action: 'giveCheevie',
                    });
                });
            }, 200);
        });

        return;
    }
}
