import Controller from '@ember/controller';
import { inject as service } from '@ember/service';

export default Controller.extend({
    activity: service(),

    actions: {
        goBack() {
            return window.history.back();
        },

        pickCheevie(cheevie) {
            const user = this.model.user;
            user.get('cheevies').pushObject(cheevie);
            user.save()
                .then(() =>
                    this.activity.send({
                        cheevie,
                        action: 'giveCheevie',
                    })
                )
                .then(() => window.history.back());
        },
    },
});
