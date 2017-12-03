import { helper } from '@ember/component/helper';

export function eq(params/*, hash*/) {
  return !!params.reduce((sum, a) => (sum === a) ? a : null);
}

export default helper(eq);
