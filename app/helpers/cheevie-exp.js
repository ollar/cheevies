import { helper } from '@ember/component/helper';

const poinsMap = {
  low: 10,
  normal: 20,
  high: 30,
};

export function cheevieExp([cheevies] /*, hash*/) {
  return cheevies.reduce((sum, item) => {
    return sum + poinsMap[item.get('power')];
  }, 0);
}

export default helper(cheevieExp);
