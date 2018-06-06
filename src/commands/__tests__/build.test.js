'use strict';

/* eslint-env jest */

const commandAdd = require('../build_cmds/add');
const environment = require('../../environment');
const logger = require('../../logger');
const Zeus = require('../../sdk');

jest.mock('../../environment');
jest.mock('../../logger');
jest.mock('../../sdk/client');

describe('build add command', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    Zeus.instance.addBuild.mockImplementation(() => Promise.resolve({}));
  });

  test('adds a new build', () => {
    const argv = {
      number: 1,
      ref: '0000000',
      label: 'First commit',
      url: 'https://invalid/1',
    };

    expect.assertions(1);
    return commandAdd.handler(argv).then(() => {
      expect(Zeus.instance.addBuild.mock.calls[0]).toMatchSnapshot();
    });
  });

  test('uses the build ID from the environment', () => {
    environment.buildId = 12345;
    const argv = {
      ref: '0000000',
      label: 'First commit',
      url: 'https://invalid/1',
    };

    expect.assertions(1);
    return commandAdd.handler(argv).then(() => {
      expect(Zeus.instance.addBuild.mock.calls[0]).toMatchSnapshot();
    });
  });

  test('logs the successful update', () => {
    expect.assertions(1);
    return commandAdd.handler({}).then(() => {
      const successMessage = 'Build updated';
      expect(logger).toHaveBeenCalledWith(
        expect.stringMatching(successMessage)
      );
    });
  });

  test('logs errors from the SDK', () => {
    Zeus.instance.addBuild.mockImplementation(() =>
      Promise.reject(new Error('expected failure'))
    );

    expect.assertions(1);
    return commandAdd.handler({}).then(() => {
      expect(logger).toHaveBeenCalledWith(
        expect.stringMatching(/expected failure/)
      );
    });
  });
});
