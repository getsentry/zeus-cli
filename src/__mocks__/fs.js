'use strict';

/* eslint-env jest */
const fs = {};
module.exports = fs;

fs.existsSync = jest.fn(() => false);
fs.createReadStream = jest.fn(path => ({ path }));
