const fetch = require('node-fetch');

/**
 * Parses an error message from the given response
 *
 * First, this function tries to parse an error message from the response body.
 * If this does not work, it falls back to the HTTP status text.
 *
 * @param {Response} response A fetch Response object
 * @returns {Promise<Error>} A promise that resolves the error
 */
async function parseError(response) {
  try {
    const { message } = await response.json();
    return new Error(message || `${response.status} ${response.statusText}`);
  } catch (e) {
    return new Error(`${response.status} ${response.statusText}`);
  }
}

/**
 * Performs an AJAX request to the given url with the specified options using
 * fetch
 *
 * After the request has finished, the result is parsed and checked for errors.
 * In case of an error, the response message is thrown as an error. On success,
 * the parsed JSON is passed into the promise.
 *
 * @param {string} url The destination of the AJAX call
 * @param {object} options Options to the {@link fetch} call
 * @returns {Promise<object?>} A Promise to the parsed response body
 */
async function request(url, options = {}) {
  const response = await fetch(url, options);
  if (!response.ok) {
    throw await parseError(response);
  }

  return response.status === 204 ? undefined : response.json();
}

module.exports = request;
