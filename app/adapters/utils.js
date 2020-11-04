import {
  AbortError,
  TimeoutError,
} from '@ember-data/adapter/error';

export function fetchSuccessHandler(adapter, payload, response, requestData) {
  let responseData = fetchResponseData(response);
  return ajaxSuccess(adapter, payload, requestData, responseData);
}


export function fetchErrorHandler(adapter, payload, response, errorThrown, requestData) {
  let responseData = fetchResponseData(response);

  if (responseData.status === 200 && payload instanceof Error) {
    responseData.errorThrown = payload;
    payload = responseData.errorThrown.payload;
  } else {
    responseData.errorThrown = errorThrown;
    payload = adapter.parseErrorResponse(payload);
  }
  return ajaxError(adapter, payload, requestData, responseData);
}


function fetchResponseData(response) {
  return {
    status: response.status,
    textStatus: response.textStatus,
    headers: headersToObject(response.headers),
  };
}


function ajaxSuccess(adapter, payload, requestData, responseData) {
  let response;
  try {
    response = adapter.handleResponse(responseData.status, responseData.headers, payload, requestData);
  } catch (error) {
    return Promise.reject(error);
  }

  if (response && response.isAdapterError) {
    return Promise.reject(response);
  } else {
    return response;
  }
}


function ajaxError(adapter, payload, requestData, responseData) {
  let error;

  if (responseData.errorThrown instanceof Error && payload !== '') {
    error = responseData.errorThrown;
  } else if (responseData.textStatus === 'timeout') {
    error = new TimeoutError();
  } else if (responseData.textStatus === 'abort' || responseData.status === 0) {
    error = handleAbort(requestData, responseData);
  } else {
    try {
      error = adapter.handleResponse(
        responseData.status,
        responseData.headers,
        payload || responseData.errorThrown,
        requestData
      );
    } catch (e) {
      error = e;
    }
  }

  return error;
}


function headersToObject(headers) {
  let headersObject = {};

  if (headers) {
    headers.forEach((value, key) => (headersObject[key] = value));
  }

  return headersObject;
}


// Adapter abort error to include any relevent info, e.g. request/response:
function handleAbort(requestData, responseData) {
  let { method, url, errorThrown } = requestData;
  let { status } = responseData;
  let msg = `Request failed: ${method} ${url} ${errorThrown || ''}`;
  let errors = [{ title: 'Adapter Error', detail: msg.trim(), status }];
  return new AbortError(errors);
}