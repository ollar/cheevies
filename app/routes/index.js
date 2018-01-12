import Route from '@ember/routing/route';
import RSVP from 'rsvp';
import { schedule } from '@ember/runloop';
import Middleware from '../utils/animation-middleware';

function handleGyroChange($heroUsersCanvas, $heroCheeviesCanvas, event) {
  let {beta, gamma} = event;

  const uctx = $heroUsersCanvas.getContext('2d');
  const cctx = $heroCheeviesCanvas.getContext('2d');

  if (beta >  89) { beta =  89}
  if (beta < -89) { beta = -89}

  if (gamma >  89) { gamma =  89}
  if (gamma < -89) { gamma = -89}

  window.requestAnimationFrame(() => {
    uctx.clearRect(-180, -180, uctx.canvas.width + 180, uctx.canvas.height + 180);
    uctx.setTransform(1, 0, 0, 1, gamma, beta);
    uctx.fillRect(-180, -180, uctx.canvas.width + 180, uctx.canvas.height + 180);

    cctx.clearRect(-180, -180, cctx.canvas.width + 180, cctx.canvas.height + 180);
    cctx.setTransform(1, 0, 0, 1, gamma, beta);
    cctx.fillRect(-180, -180, cctx.canvas.width + 180, cctx.canvas.height + 180);
  });
}

function createBGCanvas($parent, image) {
  const canvas = document.createElement('canvas');

  const ctx = canvas.getContext('2d');

  let canvasWidth = $parent.offsetWidth;
  let canvasHeight = $parent.offsetHeight;

  const img = new Image();
  img.src = image;
  ctx.fillStyle = 'rgba(0,0,0,0)';
  ctx.fillRect(-180, -180, canvasWidth + 180, canvasHeight + 180);

  img.onload = function() {
    const pattern = ctx.createPattern(img, 'repeat');
    ctx.fillStyle = pattern;
    ctx.fillRect(-180, -180, canvasWidth + 180, canvasHeight + 180);
  };

  canvas.width = canvasWidth;
  canvas.height = canvasHeight;

  $parent.appendChild(canvas);

  return canvas;
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

      const $heroUsersCanvas = createBGCanvas($heroUsersWrapper, './images/511_2.png');
      const $heroCheeviesCanvas = createBGCanvas($heroCheeviesWrapper, './images/609_2.png');

      const handleGyroChangeCarred =
        handleGyroChange.bind(null, $heroUsersCanvas, $heroCheeviesCanvas);

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
        am.go(() => console.log('complete'));
      });
    });
  }
});
