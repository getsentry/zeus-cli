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

  getHeaders() {
    return { 'content-type': 'multipart/form-data; boundary=---feedface' };
  }
};
