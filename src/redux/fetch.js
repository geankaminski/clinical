/* istanbul ignore file */
import 'whatwg-fetch';
import { stringify } from 'qs';
import { curry, get as lodashGet } from 'lodash';

function headersWithAuth(auth = true) {
  if (!auth) return {};
  const accessToken = lodashGet(JSON.parse(window.memoryDB.tokenInfo || '{}'), 'data.token');
  if (accessToken) {
    return { accessToken: `Token ${accessToken}`};
  }
  return {};
}

export function makeApiUrl(endpoint, query) {
  const queryString = stringify(query, { encode: false, arrayFormat: 'brackets' });
  return `${endpoint}${queryString ? '?' : ''}${queryString}`;
}

async function checkStatus(response) {
  if (response.status < 400) {
    return response;
  }
  const error = new Error(response.statusText);
  error.response = await response.json();
  error.status = response.status;
  throw error;
}

function processError({ endpoint/* , query, auth, url, method */ }) {
  /* const metadata = {
    endpoint,
    query,
    url,
    auth,
    method
  };

  const name = `API Error: ${method} ${endpoint}`;
  const severity = 'error'; */

  return error => ({
    error: {
      status: error.status,
      message: lodashGet(error, 'response.message'),
    },
  });
}

async function processResponse(response) {
  const body = await response.json();
  return {
    response: {
      headers: response.headers,
      body,
      status: response.status,
    },
  };
}

export async function get(endpoint, query, auth = true) {
  const url = makeApiUrl(
    endpoint,
    {
      ...query,
    },
    auth,
  );
  const token = headersWithAuth(auth);
  try {
    const res = await fetch(url, {
      headers: {
        Authorization: `${token.accessToken}`,
      },
    });
    const status = await checkStatus(res);
    const processedResponse = await processResponse(status);
    return processedResponse;
  } catch (e) {
    return processError({
      endpoint,
      query,
      url,
      method: 'GET',
    })(e);
  }
}
async function postOrPutOrDelete(
  method,
  endpoint,
  {
    query,
    auth = true,
    requestBody = {},
    contentType = 'application/json',
  } = {},
) {
  const url = makeApiUrl(
    endpoint,
    {
      ...query,
    });
  const token = headersWithAuth(auth);
  try {
    const res = await fetch(url, {
      method,
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Content-Type': contentType,
        Accept: 'application/json',
        Authorization: `${token.accessToken}`,
        'Csrf-Token': 'nocheck',
      },
      body: JSON.stringify(requestBody),
    });
    const status = await checkStatus(res);
    const processedResponse = await processResponse(status);
    return processedResponse;
  } catch (e) {
    return processError({
      endpoint,
      query,
      url,
      auth,
      method: 'GET',
    })(e);
  }
}

export const post = curry(postOrPutOrDelete)('POST');
export const put = curry(postOrPutOrDelete)('PUT');
export const del = curry(postOrPutOrDelete)('DELETE');
export const patch = curry(postOrPutOrDelete)('PATCH');
