import { helper } from '@ember/component/helper';

export function add(params/*, hash*/) {
  return params.reduce((a, b) => a + b);
}

export default helper(add);
