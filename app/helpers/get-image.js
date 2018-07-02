import { helper } from '@ember/component/helper';

export function getImage([imageSet, size]/*, hash*/) {
  return imageSet.get(size);
}

export default helper(getImage);
