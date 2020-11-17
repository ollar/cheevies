import Component from '@glimmer/component';
import { later } from '@ember/runloop';
import Middleware from 'cheevies/utils/middleware';

export default class PropsContainerComponent extends Component {
    shuffleProps(element) {
        const middleware = new Middleware();
        const height = element.offsetHeight;
        const width = element.offsetWidth;
        const $props = element.querySelectorAll('svg');

        $props.forEach($prop => {
            $prop.style.left = `${Math.random() * width / 2}px`;
            $prop.style.top = `${Math.random() * height / 2}px`;
        });

        later(() => {
            $props.forEach($prop => {
                middleware.use(next => {
                    later(() => {
                        $prop.style.transform = `translate(${Math.random() * width}px, -${Math.random() * height}px)`;
                        $prop.style.opacity = 1;

                        next();
                    }, 100);
                });
            });

            middleware.go(() => true);
        }, 100);
    }
}
