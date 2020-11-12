import Controller from '@ember/controller';
import { action } from '@ember/object';
import { tracked } from '@glimmer/tracking';

export default class IndexIndexController extends Controller {
    @tracked activePage = 'users';

    constructor() {
        super(...arguments);
        this.shouldHideGuidePopup = window.localStorage.getItem('hideGuidePopup');
    }

    get users() {
        return this.model.users.filter(user => user.id !== this.model.me.id);
    }

    @action
    openDrawer() {
        this.send('toggleDrawer');
    }

    @action
    setActivePage(type) {
        this.set('activePage', type);
    }
}
