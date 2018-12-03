import Controller from '@ember/controller';
import { inject as service } from '@ember/service';
import { TimelineLite } from 'gsap';

export default Controller.extend({
    activity: service(),

    actions: {
        goBack() {
            return window.history.back();
        },

        pickCheevie(cheevie) {
            let _this = this;
            let tline = new TimelineLite({
                onComplete() {
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

            tline
                .to(`#${cheevie.id}`, 0.2, { y: -100, scale: 1.2 })
                .to(`#${cheevie.id}`, 0.2, { opacity: 0 });
        },
    },
});
