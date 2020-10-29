import Component from '@glimmer/component';
import { readOnly } from '@ember/object/computed';
import { action } from '@ember/object';
import { inject as service } from '@ember/service';


export default class SiteHeaderComponent extends Component {
    @service router;
    @readOnly('router.currentRouteName') currentRouteName;

    get isIndex() {
        return this.currentRouteName.startsWith('index');
    }

    @action
    goBack() {
      return window.history.back();
    }
}
