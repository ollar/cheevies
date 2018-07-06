import FirebaseAdapter from 'emberfire/adapters/firebase';

export default FirebaseAdapter.extend({
  shouldBackgroundReloadAll: () => true,
  shouldBackgroundReloadRecord: () => true,
  shouldReloadAll: () => false,
  shouldReloadRecord: () => false,
});
