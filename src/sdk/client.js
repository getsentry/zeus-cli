'use strict';

const FormData = require('form-data');
const URL = require('whatwg-url').URL;
const request = require('./request');

/**
 * Default URL of the Zeus server
 */
const DEFAULT_URL = 'https://zeus.ci/';

/**
 * @typedef {object} Logger A console logger
 *
 * @prop {function} log Logs a message with the default level
 * @prop {function} error Logs an error message
 * @prop {function} warn Logs a warning
 * @prop {function} info Logs an info message
 * @prop {function} debug Logs a debug message
 */

/**
 * @typedef {object} ZeusOptions Options possed to the Zeus client constructor
 *
 * @prop {string} url The URL to the Zeus server. Defaults to https://zeus.ci
 * @prop {string} token Authentication token for the API
 * @prop {Logger} logger A logger with the same interface like console
 */

/**
 * Validates the given URL and makes sure it ends with a trailing slash.
 * If the URL is not valid, an Error with details is thrown.
 *
 * @param {string} url A fully qualified URL to sanitize
 * @returns {string} The sanitized URL
 */
function sanitizeURL(url) {
  let sanitized = new URL(url).toString();

  if (!sanitized.endsWith('/')) {
    sanitized += '/';
  }

  return sanitized;
}

/**
 * Zeus API client
 */
class Client {
  /**
   * Creates a new API client
   *
   * @param {ZeusOptions} options Optional parameters for the client
   * @constructor
   */
  constructor(options) {
    const o = options || {};
    this.url = sanitizeURL(o.url || process.env.ZEUS_URL || DEFAULT_URL);
    this.token = o.token || process.env.ZEUS_TOKEN || '';
    this.logger = o.logger || console;
  }

  /**
   * Performs an API request to the given path.
   *
   * The request is performed relative to the configured url, unless the path is
   * a fully qualified URL with protocol and host. In that case, the request is
   * performed to the path as is.
   *
   * If configured, the authorization token is added to the request headers. It
   * can be overriden by passing a value for the "Authorization" header.
   *
   * On success, the parsed JSON result is passed into the promise. In case the
   * request fails or returns with a status code outside of the 200
   * range, an error is thrown with the response message field or status text.
   *
   * @param {string} path The endpoint of the API call.
   * @param {object} options Options to the {@link fetch} call.
   * @returns {Promise<object>} A Promise to the parsed response body.
   */
  request(path, options) {
    const headers = Object.assign({}, (options || {}).headers);
    if (this.token && !headers.Authorization) {
      headers.Authorization = `Bearer ${this.token.toLowerCase()}`;
    }

    try {
      const url = new URL(path, this.url).toString();
      const opts = Object.assign({}, options, { headers });
      return request(url, opts);
    } catch (e) {
      return Promise.reject(e);
    }
  }

  /**
   * Uploads a new build artifact for a given job.
   *
   * @param {object} params Parameters for the upload request
   * @returns {Promise<object>} The server response
   */
  uploadArtifact(params) {
    const base = process.env.ZEUS_HOOK_BASE;

    try {
      if (!base) {
        throw new Error('Missing ZEUS_HOOK_BASE environment variable');
      } else if (!params.build) {
        throw new Error('Missing build identifier');
      } else if (!params.job) {
        throw new Error('Missing job identifier');
      } else if (!params.file) {
        throw new Error('Missing file parameter');
      }

      const data = new FormData();
      data.append('file', params.file);
      if (params.type) {
        data.append('type', params.type);
      }

      const url = new URL(
        `builds/${params.build}/jobs/${params.job}/artifacts`,
        sanitizeURL(base)
      ).toString();

      return this.request(url, {
        headers: data.getHeaders(),
        method: 'POST',
        body: data,
      });
    } catch (e) {
      return Promise.reject(e);
    }
  }
}

module.exports = Client;
Client.DEFAULT_URL = DEFAULT_URL;
