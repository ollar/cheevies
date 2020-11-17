import RestAdapter from '@ember-data/adapter/rest';
import { getOwner } from '@ember/application';
import { inject as service } from '@ember/service';
import { determineBodyPromise } from '@ember-data/adapter/-private';
import { fetchSuccessHandler, fetchErrorHandler } from './utils';


const TOKEN_EXPIRED = 'TOKEN_EXPIRED';
const TOKEN_INVALID = 'TOKEN_INVALID';


export default class ApplicationAdapter extends RestAdapter {
    @service session;

    sortQueryParams = false;

    get host() {
        return this._apiHost;
    }

    get _apiHost() {
        return getOwner(this).application.apiHost;
    }

    get namespace() {
        return `api/${getOwner(this).application.appName}`;
    }

    get accessToken() {
        const { authenticated } = this.session.data;
        return authenticated ? authenticated.access : null;
    }

    get headers() {
        if (!this.accessToken) return {};
        return {
            "Authorization": `Bearer ${this.accessToken}`
        }
    }

    /**
    Takes a URL, an HTTP method and a hash of data, and makes an
    HTTP request.
    When the server responds with a payload, Ember Data will call into `extractSingle`
    or `extractArray` (depending on whether the original query was for one record or
    many records).
    By default, `ajax` method has the following behavior:
    * It sets the response `dataType` to `"json"`
    * If the HTTP method is not `"GET"`, it sets the `Content-Type` to be
      `application/json; charset=utf-8`
    * If the HTTP method is not `"GET"`, it stringifies the data passed in. The
      data is the serialized record in the case of a save.
    * Registers success and failure handlers.
    @method ajax
    @private
    @param {String} url
    @param {String} type The request type GET, POST, PUT, DELETE etc.
    @param {Object} options
    @return {Promise} promise
  */
    ajax(url, type, options) {
        let adapter = this;
        let useFetch = this.useFetch;

        let requestData = {
          url: url,
          method: type,
        };
        let hash = adapter.ajaxOptions(url, type, options);

        if (useFetch) {
            let _response;
            return this._fetchRequest(hash)
                .then(response => {
                    _response = response;
                    return determineBodyPromise(response, requestData);
                })
                .then(payload => {
                    if (_response.ok && !(payload instanceof Error)) {
                        return fetchSuccessHandler(adapter, payload, _response, requestData);
                    } else {
                        if (_response.status === 403) {
                            payload = adapter.parseErrorResponse(payload);

                            if (payload.error === TOKEN_EXPIRED) {
                                return this.session.refreshToken()
                                    .then(() => this.ajax(url, type, options));
                            } else if (payload.error === TOKEN_INVALID) {
                                return this.session.invalidate();
                            }
                        }

                        throw fetchErrorHandler(adapter, payload, _response, null, requestData);
                    }
                });
        }

        return super.ajax(url, type, options);
    }

    query(store, type, query) {
        let url = this.buildURL(type.modelName, null, null, 'query', query);

        if (query.find) {
            url += `?find=${encodeURIComponent(JSON.stringify(query.find))}`;
        }
        if (query.sort) {
            url += `&sort=${encodeURIComponent(JSON.stringify(query.sort))}`;
        }
        if (query.page) {
            url += `&page=${query.page}`;
        }

        return this.ajax(url, 'GET');
    }

    save() {
        debugger

        return super.save(...arguments);
    }
}
