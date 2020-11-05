import SessionService from 'ember-simple-auth/services/session';
import { getOwner } from '@ember/application';
import { action } from '@ember/object';

const TOKEN_NOT_VALID = 'token_not_valid';

function checkResponseStatus(response) {
    if (!response.ok) throw response;
    return response;
}

export default class MySessionService extends SessionService {
    get _authHost() {
        return getOwner(this).application.authHost;
    }

    handleAuthentication() {
        return '';
    }

    register(data) {
        return fetch(`${this._authHost}/register`, {
                method: 'post',
                mode: 'cors',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(data)
            })
            .then(checkResponseStatus)
            .catch(error => error.json().then(body => {throw body}));
    }

    refreshToken() {
        const data = {
            refresh: this.data.authenticated.refresh
        };

        const { authenticated } = this.data;

        return fetch(`${this._authHost}/api/token/refresh/`, {
            method: 'post',
            mode: 'cors',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(data)
        })
        .then(checkResponseStatus)
        .then(res => res.json())
        .catch(error => error.json().then(body => {
            if (body.code === TOKEN_NOT_VALID) this.invalidate();
            throw body;
        }))
        .then(({ access }) => {
            authenticated.access = access;
            this.session.store.persist({ authenticated });
            this.set('data.authenticated.access', access);
        });
    }

    @action
    persist(key, value) {
        const { authenticated } = this.data;

        authenticated[key] = value;

        this.session.store.persist({ authenticated });
        this.set(`data.authenticated.${key}`, value);
    }
}