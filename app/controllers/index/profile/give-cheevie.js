import Controller from '@ember/controller';
import { inject as service } from '@ember/service';
import { action } from '@ember/object';
import { tracked } from '@glimmer/tracking';

import { TimelineLite } from 'gsap';


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
        let tline = new TimelineLite({
            onComplete() {
                const user = _this.model;
                user.get('cheevies').pushObject(cheevie);
                user.save().then(() => {
                    _this.busy = false;
                    _this.activity.send({
                        cheevie,
                        action: 'giveCheevie',
                    });
                });
            },
        });

        tline.to($cheevie, 0.2, { y: -100, scale: 1.2, opacity: 0.3 }).to($cheevie, 0.2, { opacity: 0 });
    }
}
