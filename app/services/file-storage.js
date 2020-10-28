import { computed } from '@ember/object';
import Service, { inject as service } from '@ember/service';

export default Service.extend({
    firebase: service('firebase-app'),

    storageRef: computed(function() {
        return this.firebase.storage();
    }),

    upload(path, file) {
        const metadata = {
            cacheControl: 'public,max-age=31536000',
        };
        return this.storageRef
            .then(storage => storage.ref(path))
            .then(ref => ref.put(file, metadata))
            .then(snapshot => snapshot.metadata);
    },

    remove(imageModel, path) {
        const _path = (imageModel && imageModel.get('fullPath')) || path;

        if (!_path) throw new Error('no file path specified');
        return this.storageRef
            .then(storage => storage.ref(_path))
            .then(ref => ref.delete());
    },
});
