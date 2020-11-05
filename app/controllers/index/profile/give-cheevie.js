import Controller from '@ember/controller';
import { inject as service } from '@ember/service';
import { action } from '@ember/object';
import { TimelineLite } from 'gsap';

export default class ProfileController extends Controller {
    @service activity;

    get cheevies() {
        return this.model.cheevies;
    }

    @action
    goBack() {
        return window.history.back();
    }

    @action
    pickCheevie(cheevie) {
        let _this = this;
        let $cheevie = document.getElementById(cheevie.id);
        let tline = new TimelineLite({
            onComplete() {
                _this.set(
                    'cheevies',
                    _this.model.cheevies.filter(_cheevie => _cheevie.id !== cheevie.id)
                );

                const user = _this.model.user;
                user.get('cheevies').pushObject(cheevie);
                user.save().then(() =>
                    _this.activity.send({
                        cheevie,
                        action: 'giveCheevie',
                    })
                );
                // .then(() => window.history.back());
            },
        });

        tline.to($cheevie, 0.2, { y: -100, scale: 1.2 }).to($cheevie, 0.2, { opacity: 0 });
    }
}
