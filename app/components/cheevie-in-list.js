import Component from '@glimmer/component';
import { inject as service } from '@ember/service';

export default class CheevieInListComponent extends Component {
    @service me;

    get isMine() {
        if (!this.me.model) return false;
        const cheevies = this.me.model.cheevies.toArray().map(c => c.id);
        return cheevies.includes(this.args.cheevie.id);
    }

    get image() {
        return {
            sm: this.args.cheevie.get('image-set.64'),
            md: this.args.cheevie.get('image-set.128'),
            lg: this.args.cheevie.get('image-set.256'),
        }
    }
}
