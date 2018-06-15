'use strict';

/* eslint-env jest */

const instance = {
  getUrl: path => `https://zeus.ci${path}`,
  uploadArtifact: jest.fn(),
  request: jest.fn(),
  createOrUpdateBuild: jest.fn(),
  createOrUpdateJob: jest.fn(),
};

module.exports = {};
module.exports.Client = jest.fn(() => instance);
module.exports.instance = instance;
