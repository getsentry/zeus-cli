'use strict';

/* eslint-env jest */
/* eslint-disable class-methods-use-this */

module.exports = class FormData {
  constructor(options) {
    this.options = options;
    this.data = {};
  }

  append(field, value) {
    this.data[field] = value;
  }

  getHeaders(headers) {
    return Object.assign(
      { 'content-type': 'multipart/form-data; boundary=---feedface' },
      headers
    );
  }

  getLength(cb) {
    cb(null, 42);
  }
};
