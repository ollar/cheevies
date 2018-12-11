import Controller from '@ember/controller';
import { inject as service } from '@ember/service';
import { computed } from '@ember/object';
import { TimelineLite } from 'gsap';

export default Controller.extend({
    activity: service(),

    cheevies: computed.alias('model.cheevies'),

    actions: {
        goBack() {
            return window.history.back();
        },

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
        },
    },
});
