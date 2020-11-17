import Component from '@glimmer/component';
import { action } from '@ember/object';
import { later } from '@ember/runloop';

export default class ProfileAnimationWrapperComponent extends Component {
    @action
    didInsert() {
        const $userImage = document.querySelector('.user-image');
        const $name = document.querySelector('.name');
        const $cheevies = document.querySelector('.cheevies');

        $userImage.style.scale = 1.2;
        $userImage.style.opacity = 0;
        $name.style.opacity = 0;
        $cheevies.style.scale = 0.8;
        $cheevies.style.opacity = 0;

        later(() => {
            $userImage.style.scale = '';
            $userImage.style.opacity = '';

            later(() => {
                $name.style.opacity = '';

                later(() => {
                    $cheevies.style.scale = '';
                    $cheevies.style.opacity = '';
                }, 200);
            }, 100);
        });
    }
}
