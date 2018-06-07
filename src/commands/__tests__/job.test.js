'use strict';

/* eslint-env jest */

const commandAdd = require('../job_cmds/add');
const environment = require('../../environment');
const logger = require('../../logger');
const Zeus = require('../../sdk');

jest.mock('../../environment');
jest.mock('../../logger');
jest.mock('../../sdk/client');

describe('job add command', () => {
  let func;

  beforeEach(() => {
    jest.clearAllMocks();
    Zeus.instance.createOrUpdateJob = jest.fn();
    Zeus.instance.createOrUpdateJob.mockImplementation(() =>
      Promise.resolve({})
    );
    func = Zeus.instance.createOrUpdateJob;
  });

  test('adds a new job', () => {
    const argv = {
      build: 1,
      'build-label': 'New job',
      url: 'https://invalid/job/1',
    };

    expect.assertions(1);
    return commandAdd.handler(argv).then(() => {
      expect(func.mock.calls[0]).toMatchSnapshot();
    });
  });

  test('uses the job ID from the environment', () => {
    environment.jobId = 12345;
    const argv = {};

    expect.assertions(1);
    return commandAdd.handler(argv).then(() => {
      expect(func.mock.calls[0]).toMatchSnapshot();
    });
  });

  test('uses the build ID from the environment', () => {
    environment.buildId = 2345;
    const argv = {};

    expect.assertions(1);
    return commandAdd.handler(argv).then(() => {
      expect(func.mock.calls[0]).toMatchSnapshot();
    });
  });

  test('uses the commit ID from the environment', () => {
    environment.commitId = '1234567';
    const argv = {};

    expect.assertions(1);
    return commandAdd.handler(argv).then(() => {
      expect(func.mock.calls[0]).toMatchSnapshot();
    });
  });

  test('logs the successful job update', () => {
    expect.assertions(1);
    return commandAdd.handler({}).then(() => {
      const successMessage = 'Job updated';
      expect(logger).toHaveBeenCalledWith(
        expect.stringMatching(successMessage)
      );
    });
  });

  test('logs errors from the SDK', () => {
    func.mockImplementation(() =>
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
