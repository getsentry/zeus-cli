'use strict';

/* eslint-env jest */

const fs = require('fs');
const command = require('../upload');
const environment = require('../../environment');
const logger = require('../../logger');
const Zeus = require('@zeus-ci/sdk');

jest.mock('fs');
jest.mock('../../environment');
jest.mock('../../logger');

describe('upload command', () => {
  beforeEach(() => {
    jest.clearAllMocks();

    fs.existsSync.mockImplementation(name => /existing.*\.json/.test(name));
    Zeus.instance.uploadArtifact.mockImplementation(() =>
      Promise.resolve({
        id: '9f32e479-0382-43c3-a18e-d35de81c58dc',
        download_url: '/artifacts/9f32e479/download',
      })
    );
  });

  test('uploads the artifact', () => {
    const argv = {
      file: ['existing.json'],
      build: '12345',
      job: '54321',
      type: 'application/json',
      name: 'renamed.json',
    };

    expect.assertions(1);
    return command.handler(argv).then(() => {
      expect(Zeus.instance.uploadArtifact.mock.calls[0]).toMatchSnapshot();
    });
  });

  test('uploads multiple artifacts', () => {
    const argv = {
      file: ['existing1.json', 'existing2.json'],
      build: '12345',
      job: '54321',
      type: 'application/json',
      name: 'renamed.json',
    };

    expect.assertions(1);
    return command.handler(argv).then(() => {
      expect(Zeus.instance.uploadArtifact.mock.calls).toMatchSnapshot();
    });
  });

  test('logs the artifact download URL', () => {
    const argv = {
      file: ['existing.json'],
      build: '12345',
      job: '54321',
      type: 'application/json',
      name: 'renamed.json',
    };

    expect.assertions(1);
    return command.handler(argv).then(() => {
      const downloadUrl = 'https://zeus.ci/artifacts/9f32e479/download';
      expect(logger).toHaveBeenCalledWith(expect.stringMatching(downloadUrl));
    });
  });

  test('uses the build ID from the environment', () => {
    environment.buildId = '12345';
    const argv = {
      file: ['existing.json'],
      job: '54321',
      type: 'application/json',
    };

    expect.assertions(1);
    return command.handler(argv).then(() => {
      expect(Zeus.instance.uploadArtifact.mock.calls[0]).toMatchSnapshot();
    });
  });

  test('uses the job ID from the environment', () => {
    environment.jobId = '54321';
    const argv = {
      file: ['existing.json'],
      build: '12345',
      type: 'application/json',
    };

    expect.assertions(1);
    return command.handler(argv).then(() => {
      expect(Zeus.instance.uploadArtifact.mock.calls[0]).toMatchSnapshot();
    });
  });

  test('uses an empty filename by default', () => {
    const argv = {
      file: ['existing.json'],
      build: '12345',
      job: '54321',
      type: 'application/json',
    };

    expect.assertions(1);
    return command.handler(argv).then(() => {
      expect(Zeus.instance.uploadArtifact.mock.calls[0]).toMatchSnapshot();
    });
  });

  test('logs an error for missing files', () => {
    const argv = {
      file: ['invalid.json'],
      build: '12345',
      job: '54321',
      type: 'application/json',
    };

    expect.assertions(1);
    return command.handler(argv).then(() => {
      expect(logger).toHaveBeenCalledWith(expect.stringMatching(/not exist/));
    });
  });

  test('logs errors from the SDK', () => {
    const argv = {
      file: ['existing.json'],
      build: '12345',
      job: '54321',
      type: 'application/json',
    };

    Zeus.instance.uploadArtifact.mockImplementation(() =>
      Promise.reject(new Error('expected failure'))
    );

    expect.assertions(1);
    return command.handler(argv).then(() => {
      expect(logger).toHaveBeenCalledWith(
        expect.stringMatching(/expected failure/)
      );
    });
  });
});
