import Component from '@glimmer/component';

export default class UserInListComponent extends Component {
    get image() {
        const { user } = this.args;
        if (!user.get('image-set.128')) return null;
        return {
            sm: user.get('image-set.128'),
            md: user.get('image-set.256'),
            lg: user.get('image-set.512'),
        };
    }

    get cheevies() {
        const cheevies = this.args.cheevies ? this.args.cheevies.toArray() : [];

        const userCheevies = this.args.user.cheevies.toArray().map(c => c.id);
        const groupCheevies = cheevies.toArray().map(c => c.id);

        return userCheevies.filter(cheevie => groupCheevies.includes(cheevie));
    }
}
