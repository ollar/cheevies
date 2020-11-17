import BaseAuthenticator from 'ember-simple-auth/authenticators/base';
import { getOwner } from '@ember/application';

function checkResponseStatus(response) {
    if (!response.ok) throw response;
    return response;
}

export default BaseAuthenticator.extend({
    get _authHost() {
        return getOwner(this).application.authHost;
    },

    restore(data) {
        return Promise.resolve(data);
    },

    authenticate(data) {
        return fetch(`${this._authHost}/api/token/`, {
            method: 'post',
            mode: 'cors',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(data)
        })
        .then(checkResponseStatus)
        .then(res => res.json())
        .catch(error => error.json().then(body => {throw body}));
    },
});
