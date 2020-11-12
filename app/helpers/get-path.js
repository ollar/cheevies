import { helper } from '@ember/component/helper';
import getRootUrl from 'cheevies/utils/get-root-url';

export default helper(function getPath(params/*, hash*/) {
  return getRootUrl() + params;
});
