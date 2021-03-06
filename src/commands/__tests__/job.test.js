'use strict';

/* eslint-env jest */

const commandUpdate = require('../job_cmds/update');
const getEnv = require('../../environment').getEnvironment;
const logger = require('../../logger');
const Zeus = require('@zeus-ci/sdk');

jest.mock('../../environment');
jest.mock('../../logger');

describe('job add command', () => {
  let func;

  beforeEach(() => {
    jest.clearAllMocks();
    Zeus.instance.createOrUpdateBuild.mockImplementation(() =>
      Promise.resolve({})
    );
    Zeus.instance.createOrUpdateJob.mockImplementation(() =>
      Promise.resolve({})
    );
    func = Zeus.instance.createOrUpdateJob;
  });

  test('adds a new job', () => {
    getEnv.mockReturnValue({});

    const argv = {
      build: 1,
      'build-label': 'New job',
      url: 'https://invalid/job/1',
    };

    expect.assertions(1);
    return commandUpdate.handler(argv).then(() => {
      expect(func.mock.calls[0]).toMatchSnapshot();
    });
  });

  test('uses the job ID from the environment', () => {
    getEnv.mockReturnValue({ jobId: 12345 });
    const argv = {};

    expect.assertions(1);
    return commandUpdate.handler(argv).then(() => {
      expect(func.mock.calls[0]).toMatchSnapshot();
    });
  });

  test('uses the build ID from the environment', () => {
    getEnv.mockReturnValue({ buildId: 2345 });
    const argv = {};

    expect.assertions(1);
    return commandUpdate.handler(argv).then(() => {
      expect(func.mock.calls[0]).toMatchSnapshot();
    });
  });

  test('uses the commit ID from the environment', () => {
    getEnv.mockReturnValue({ commitId: '1234567' });
    const argv = {};

    expect.assertions(1);
    return commandUpdate.handler(argv).then(() => {
      expect(func.mock.calls[0]).toMatchSnapshot();
    });
  });

  test('uses the build label from the environment', () => {
    getEnv.mockReturnValue({ buildLabel: 'new build label' });
    const argv = {};

    expect.assertions(1);
    return commandUpdate.handler(argv).then(() => {
      expect(func.mock.calls[0]).toMatchSnapshot();
    });
  });

  test('uses the job label from the environment', () => {
    getEnv.mockReturnValue({ jobLabel: 'new job label' });
    const argv = {};

    expect.assertions(1);
    return commandUpdate.handler(argv).then(() => {
      expect(func.mock.calls[0]).toMatchSnapshot();
    });
  });

  test('uses the url from the environment', () => {
    getEnv.mockReturnValue({ url: 'https://appveyor/job/1' });
    const argv = {};

    expect.assertions(1);
    return commandUpdate.handler(argv).then(() => {
      expect(func.mock.calls[0]).toMatchSnapshot();
    });
  });

  test('logs the successful job update', () => {
    expect.assertions(1);
    return commandUpdate.handler({}).then(() => {
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
    return commandUpdate.handler({}).then(() => {
      expect(logger).toHaveBeenCalledWith(
        expect.stringMatching(/expected failure/)
      );
    });
  });
});
