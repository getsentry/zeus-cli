'use strict';

/* eslint-env jest */
const instance = {
  getUrl: path => `https://zeus.ci${path}`,
  uploadArtifact: jest.fn(),
};

module.exports = jest.fn(() => instance);
module.exports.instance = instance;
