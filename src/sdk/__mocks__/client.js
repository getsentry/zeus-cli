'use strict';

/* eslint-env jest */
const instance = {
  uploadArtifact: jest.fn(),
};

module.exports = jest.fn(() => instance);
module.exports.instance = instance;
