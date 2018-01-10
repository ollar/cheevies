import Route from '@ember/routing/route';
import RSVP from 'rsvp';
import { schedule } from '@ember/runloop';
import Middleware from '../utils/animation-middleware';
import { inject as service } from '@ember/service';
import { addObserver } from '@ember/object/observers';

function handleGyroChange($heroUsersWrapper, $heroCheeviesWrapper, ctx, el, property) {
  let {beta, gamma} = el.get(property);

  if (beta >  89) { beta =  89}
  if (beta < -89) { beta = -89}

  if (gamma >  89) { gamma =  89}
  if (gamma < -89) { gamma = -89}

  window.requestAnimationFrame(() => {
    ctx.clearRect(0, 0, 600, 600);

    ctx.setTransform(1, 0, 0, 1, gamma, beta);
    ctx.fillRect(0, 0, 600, 600);
    // $heroUsersWrapper.style.backgroundPosition = `${gamma}px ${beta}px`;
    // $heroCheeviesWrapper.style.backgroundPosition = `${gamma}px ${beta}px`;
  });
}

export default Route.extend({
  gyro: service(),
  model() {
    return RSVP.hash({
      users: this.get('store').findAll('user'),
      badges: this.get('store').findAll('badge'),
      cheevies: this.get('store').findAll('cheevie'),
    });
  },

  activate() {
    const am = new Middleware();

    const canvas = document.createElement('canvas');
    canvas.width = 472;
    canvas.height = 653;

    canvas.style.width = '100vw';
    canvas.style.height = '100vh';
    const ctx = canvas.getContext('2d');

    const img = new Image();
    img.src = './images/511_2.png';

    img.onload = function() {
      const pattern = ctx.createPattern(img, 'repeat');
      ctx.fillStyle = pattern;
      ctx.fillRect(0, 0, 600, 600);
    };

    schedule('afterRender', () => {
      const $iconImages = document.querySelectorAll('.icon-image');
      const $heroUsersWrapper = document.querySelector('.hero.users-list');
      const $heroCheeviesWrapper = document.querySelector('.hero.cheevies-list');

      $heroUsersWrapper.appendChild(canvas);

      const handleGyroChangeCarred =
        handleGyroChange.bind(null, $heroUsersWrapper, $heroCheeviesWrapper, ctx);

      addObserver(this.get('gyro'), 'orientation', handleGyroChangeCarred);

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
        am.go(() => console.log('complete'));
      });
    });
  }
});
