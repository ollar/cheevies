import Controller from '@ember/controller';
import { action } from '@ember/object';


export default class NewCheeviesController extends Controller {
    @action
    goBack() {
        this.transitionToRoute('index');
    }
}
