import Component from '@glimmer/component';
import { action } from '@ember/object';

export default class SiteHeaderComponent extends Component {
    get isIndex() {
        return this.args.currentRouteName.startsWith('index.index');
    }

    @action
    goBack() {
      return window.history.back();
    }

    @action
    onCurrentRouteNameChange(el, routeName) {
        this.args.drawer.closeDrawer();
    }
}
