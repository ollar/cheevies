import Route from '@ember/routing/route';
import RSVP from 'rsvp';
import { schedule } from '@ember/runloop';
import Middleware from '../utils/animation-middleware';
import $ from 'jquery';

function handleGyroChange($heroUsers, $heroCheevies, event) {
  let {beta, gamma} = event;

  if (beta >  89) { beta =  89}
  if (beta < -89) { beta = -89}

  if (gamma >  89) { gamma =  89}
  if (gamma < -89) { gamma = -89}

  window.requestAnimationFrame(() => {
    $heroUsers.style.backgroundPosition = `${gamma}px ${beta}px`;
    $heroCheevies.style.backgroundPosition = `${gamma}px ${beta}px`;
  });
}

export default Route.extend({
  model() {
    return RSVP.hash({
      users: this.get('store').findAll('user'),
      badges: this.get('store').findAll('badge'),
      cheevies: this.get('store').findAll('cheevie'),
    });
  },

  activate() {
    const am = new Middleware();

    schedule('afterRender', () => {
      const $iconImages = document.querySelectorAll('.icon-image');
      const $heroUsersWrapper = document.querySelector('.hero.users-list');
      const $heroCheeviesWrapper = document.querySelector('.hero.cheevies-list');

      const handleGyroChangeCarred =
        handleGyroChange.bind(null, $heroUsersWrapper, $heroCheeviesWrapper);

      window.addEventListener('deviceorientation', handleGyroChangeCarred, true);

      am.prepare((next) => {
        $($iconImages).css({transform: 'scale(0.5)', opacity: 0});

        next();
      });

      am.chain($iconImages, [
          {transform: 'scale(0.5)', opacity: 0},
          {transform: 'scale(1)', opacity: 1},
        ],
        {
          duration: 24,
          fill: 'forwards',
        }
      );

      schedule('afterRender', () => {
        am.go(() => true);
      });
    });
  }
});
