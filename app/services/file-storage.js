import { computed } from '@ember/object';
import Service from '@ember/service';
import firebase from 'firebase';

export default Service.extend({
  storageRef: computed(function() {
    return firebase.storage();
  }),

  upload(path, file) {
    return this.get('storageRef')
      .ref(path)
      .put(file)
      .then(snapshot => snapshot.metadata);
  },

  remove(imageModel, path) {
    const _path = (imageModel && imageModel.get('fullPath')) || path;

    if (!_path) throw new Error('no file path specified');
    return this.get('storageRef')
      .ref(_path)
      .delete();
  },
});
