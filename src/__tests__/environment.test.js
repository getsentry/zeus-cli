'use strict';

/* eslint-env jest */
/* eslint-disable global-require */

const getEnv = require('../environment').getEnvironment;

// Note that these tests are mostly useless as they duplicate the code in
// `src/environments/`. However, we keep them here for now, so that people
// start thinking about changes they make to the environments carefully.
//
// Also, we should start testing in all supported CI systems at some point
// to prove actual compliance with their respective environments.

describe('environment', () => {
  const original = Object.assign({}, process.env);

  beforeEach(() => {
    jest.resetModules();
  });

  afterEach(() => {
    process.env = Object.assign({}, original);
  });

  test('returns an empty object by default', () => {
    process.env = {};

    expect(getEnv()).toEqual({});
  });

  test('detects travis', () => {
    process.env = {
      TRAVIS: 'true',
      TRAVIS_BUILD_ID: '12345',
      TRAVIS_JOB_ID: '54321',
      TRAVIS_COMMIT: '10a4cbdce931233f55e20cf09538977123d00000',
      TRAVIS_REPO_SLUG: 'getsentry/zeus-cli',
    };

    expect(getEnv()).toEqual({
      id: 'travis',
      buildId: '12345',
      jobId: '54321',
      commitId: '10a4cbdce931233f55e20cf09538977123d00000',
      url: 'https://travis-ci.org/getsentry/zeus-cli/jobs/54321',
    });
  });

  test('detects appveyor', () => {
    process.env = {
      APPVEYOR: 'True',
      APPVEYOR_BUILD_ID: '6d8442',
      APPVEYOR_JOB_ID: 'c5d4d',
      APPVEYOR_REPO_COMMIT: '10a4cbdce931233f55e20cf09538977123d00000',
      APPVEYOR_PULL_REQUEST_TITLE: 'pull request #1',
      APPVEYOR_JOB_NAME: 'job #1',
      APPVEYOR_URL: 'https://appveyor',
      APPVEYOR_ACCOUNT_NAME: 'sentry',
      APPVEYOR_PROJECT_SLUG: 'zeus-cli',
      APPVEYOR_BUILD_VERSION: '1.2.3',
    };

    expect(getEnv()).toEqual({
      id: 'appveyor',
      buildId: '6d8442',
      jobId: 'c5d4d',
      commitId: '10a4cbdce931233f55e20cf09538977123d00000',
      buildLabel: 'pull request #1',
      jobLabel: 'job #1',
      url: 'https://appveyor/project/sentry/zeus-cli/build/1.2.3/job/c5d4d',
    });
  });

  test('detects buildkite', () => {
    process.env = {
      BUILDKITE: 'true',
      BUILDKITE_BUILD_ID: '9e08ef3c-d6e6-4a86-91dd-577ce5205b8e',
      BUILDKITE_JOB_ID: 'e44f9784-e20e-4b93-a21d-f41fd5869db9',
      BUILDKITE_COMMIT: '10a4cbdce931233f55e20cf09538977123d00000',
      BUILDKITE_BUILD_URL: 'https://buildkite/org/proj/builds/1514',
    };

    expect(getEnv()).toEqual({
      id: 'buildkite',
      buildId: '9e08ef3c-d6e6-4a86-91dd-577ce5205b8e',
      jobId: 'e44f9784-e20e-4b93-a21d-f41fd5869db9',
      commitId: '10a4cbdce931233f55e20cf09538977123d00000',
      url: 'https://buildkite/org/proj/builds/1514',
    });
  });

  test('detects circleci', () => {
    process.env = {
      CIRCLECI: 'true',
      CIRCLE_WORKFLOW_ID: '921f49b4-47f2-4b3f-b19e-a65ac1998cca',
      CIRCLE_BUILD_NUM: '7638',
      CIRCLE_SHA1: 'f5e9fa82c95e22538071632bacc8fee5221c70d3',
      CIRCLE_BUILD_URL: 'https://circleci.com/gh/sentry/zeus-cli/7638',
    };

    expect(getEnv()).toEqual({
      id: 'circleci',
      buildId: '921f49b4-47f2-4b3f-b19e-a65ac1998cca',
      jobId: '7638',
      commitId: 'f5e9fa82c95e22538071632bacc8fee5221c70d3',
      url: 'https://circleci.com/gh/sentry/zeus-cli/7638',
    });
  });
});
