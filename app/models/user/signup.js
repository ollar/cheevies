import Model, { attr } from '@ember-data/model';
import Validator from '../../mixins/model-validator';

class UserRegisterModel extends Model {
    @attr username;
    @attr password;
    @attr email;

    get validations() {
        return {
            username: {
                presence: true
            },
            email: {
                presence: true,
                email: true
            },
            password: {
                presence: true,
                length: {
                    minimum: 8
                }
            }
        };
    }
}

export default UserRegisterModel.extend(Validator);
