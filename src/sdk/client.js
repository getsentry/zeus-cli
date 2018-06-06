'use strict';

const FormData = require('form-data');
const util = require('util');
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

function getHookBase() {
  const base = process.env.ZEUS_HOOK_BASE;
  if (!base) {
    throw new Error('Missing ZEUS_HOOK_BASE environment variable');
  }
  return base;
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
    this.logger.debug = this.logger.debug || function noop() {};
  }

  /**
   * Computes the absolute URL of an endpoint specified by the given path
   *
   * @param {string} path Path to an endpoint
   * @returns {string} The absolute URL to the endpoint
   */
  getUrl(path) {
    return new URL(path, this.url).toString();
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
      const method = (options || {}).method || 'GET';
      const url = this.getUrl(path);
      const opts = Object.assign({}, options, { headers });

      this.logger.debug(`${method} ${url}`);
      this.logger.debug(`Authorization: ${headers.Authorization || 'none'}`);
      return request(url, opts);
    } catch (e) {
      return Promise.reject(e);
    }
  }

  /**
   * Posts the given form the the specified endpoint
   *
   * This prevents requests with chunked transfer encoding by specifying
   * Content-Length of the body explicitly. This might lead to higher resource
   * consumption while sending the request, but works around servers that do not
   * support chunked requests.
   *
   * TODO: Once Zeus server has been updated to support chunked requests, this
   * method should be removed again.
   *
   * @param {string} path The endpoint of the API call
   * @param {object} data Key value pairs to be posted to the server
   * @returns {Promise<object>} The parsed server response
   */
  postForm(path, data) {
    const form = new FormData();
    Object.keys(data).forEach(key => {
      const value = data[key];
      if (value != null) {
        if (util.isArray(value)) {
          form.append(key, value[0], value[1]);
        } else {
          form.append(key, value);
        }
      }
    });

    return new Promise((resolve, reject) => {
      /* istanbul ignore next */
      form.getLength((e, length) => (e ? reject(e) : resolve(length)));
    }).then(length =>
      this.request(path, {
        headers: form.getHeaders({ 'Content-Length': `${length}` }),
        method: 'POST',
        body: form,
      })
    );
  }

  /**
   * Uploads one or more build artifacts for a given build job.
   *
   * @param {object} params Parameters for the upload request
   * @returns {Promise<object>} The parsed server response
   */
  uploadArtifact(params) {
    try {
      const base = getHookBase();
      if (!params.build) {
        throw new Error('Missing build identifier');
      } else if (!params.job) {
        throw new Error('Missing job identifier');
      } else if (!params.file) {
        throw new Error('Missing file parameter');
      }

      const url = new URL(
        `builds/${params.build}/jobs/${params.job}/artifacts`,
        sanitizeURL(base)
      ).toString();

      return this.postForm(url, {
        file: [params.file, params.name],
        type: params.type,
      });
    } catch (e) {
      return Promise.reject(e);
    }
  }

  /**
   * Creates or updates the remote build object.
   *
   * @param {object} params Parameters for the build
   * @returns {Promise<object>} The parsed server response
   */
  addBuild(params) {
    try {
      const base = getHookBase();
      if (!params.build) {
        throw new Error('Missing build ID');
      }

      const url = new URL(
        `builds/${params.build}`,
        sanitizeURL(base)
      ).toString();

      return this.request(url, {
        method: 'POST',
        body: JSON.stringify(params),
        headers: { 'Content-Type': 'application/json' },
      });
    } catch (e) {
      return Promise.reject(e);
    }
  }

  /**
   * Creates or updates the remote job object.
   *
   * @param {object} params Parameters for the job
   * @returns {Promise<object>} The parsed server response
   */
  addJob(params) {
    try {
      const base = getHookBase();
      if (!params.job) {
        throw new Error('Missing job ID');
      } else if (!params.build) {
        throw new Error('Missing build ID');
      }

      const addBuildPromise = this.addBuild(params);

      const url = new URL(
        `builds/${params.build}/jobs/${params.job}`,
        sanitizeURL(base)
      ).toString();

      return addBuildPromise.then(() =>
        this.request(url, {
          method: 'POST',
          body: JSON.stringify(params),
          headers: { 'Content-Type': 'application/json' },
        })
      );
    } catch (e) {
      return Promise.reject(e);
    }
  }
}

module.exports = Client;
Client.DEFAULT_URL = DEFAULT_URL;
