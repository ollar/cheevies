import FirebaseAdapter from 'emberfire/adapters/realtime-database';
import { nanoid } from 'nanoid';


export default FirebaseAdapter.extend({
    generateIdForRecord() {
        return nanoid(10);
    }
});
