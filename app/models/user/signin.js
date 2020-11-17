import Model, { attr } from '@ember-data/model';
import Validator from '../../mixins/model-validator';

class UserLoginModel extends Model {
    @attr username;
    @attr password;

    get validations() {
        return {
            username: {
                presence: true
            },
            password: {
                presence: true,
            }
        };
    }
}

export default UserLoginModel.extend(Validator);
