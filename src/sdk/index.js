const { URL } = require('url');

const FormData = require('form-data');
const request = require('./request');

/**
 * Default URL of the Zeus server
 */
const DEFAULT_URL = 'https://zeus.ci';

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
 * Zeus API client
 */
class Zeus {
  /**
   * Creates a new API client
   *
   * @param {ZeusOptions} options Optional parameters for the client
   * @constructor
   */
  constructor(options = {}) {
    this.url = options.url || process.env.ZEUS_URL || DEFAULT_URL;
    this.token = options.token || process.env.ZEUS_TOKEN || null;
    this.logger = options.logger || console;
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
  async request(path, options = {}) {
    const headers = Object.assign({}, options.headers);
    if (this.token && !headers.Authorization) {
      headers.Authorization = `bearer ${this.token.toLowerCase()}`;
    }

    const url = new URL(path, this.url).toString();
    const opts = Object.assign({}, options, { headers });
    return request(url, opts);
  }

  /**
   * Uploads a new build artifact for a given job.
   *
   * @param {object} params Parameters for the upload request
   * @returns {Promise<object>} The server response
   */
  async uploadArtifact(params) {
    const base = process.env.ZEUS_HOOK_BASE;
    const { build, file, job, type } = params;

    if (!base) {
      throw new Error('Missing ZEUS_HOOK_BASE environment variable');
    } else if (!build) {
      throw new Error('Missing build identifier');
    } else if (!job) {
      throw new Error('Missing job identifier');
    } else if (!file) {
      throw new Error('Missing file parameter');
    }

    const data = new FormData();
    data.append('file', file);
    if (params.type) {
      data.append('type', type);
    }

    return this.request(`${base}/builds/${build}/jobs/${job}/artifacts`, {
      body: data,
      method: 'POST',
    });
  }
}

module.exports = Zeus;
