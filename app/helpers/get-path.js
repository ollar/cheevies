import { helper } from '@ember/component/helper';
import ENV from 'cheevies/config/environment';

const { rootURL } = ENV;

export function getPath(params /*, hash*/) {
    return rootURL + params.join('/');
}

export default helper(getPath);
