import Component from '@glimmer/component';

export default class UserInListComponent extends Component {
    get imageSet() {
        return this.args.user['image-set'];
    }

    // todo fix me
    get image() {
        if (!this.imageSet[128]) return null;
        return {
            sm: this.get('imageSet.128'),
            md: this.get('imageSet.256'),
            lg: this.get('imageSet.512'),
        };
    }

    get cheevies() {
        const cheevies = this.args.cheevies ? this.args.cheevies.toArray() : [];

        const userCheevies = this.args.user.cheevies.toArray().map(c => c.id);
        const groupCheevies = cheevies.toArray().map(c => c.id);

        return userCheevies.filter(cheevie => groupCheevies.includes(cheevie));
    }
}
