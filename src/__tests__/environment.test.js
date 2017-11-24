/* eslint-env jest */
/* eslint-disable global-require */

// Note that these tests are mostly useless as they duplicate the code in
// `src/environments/`. However, we keep them here for now, so that people
// start thinking about changes they make to the environments carefully.
//
// Also, we should start testing in all supported CI systems at some point
// to prove actual compliance with their respective environments.

// TODO: Enable once jest@21.3.0 is stable
xdescribe('environment', () => {
  const original = Object.assign({}, process.env);

  beforeEach(() => {
    process.env = Object.assign({}, original);
    jest.resetModules();
  });

  test('returns an empty object by default', () => {
    const env = require('../environment');
    expect(env).toEqual({});
  });

  test('detects travis', () => {
    process.env = {
      TRAVIS: 'true',
      TRAVIS_BUILD_ID: '12345',
      TRAVIS_JOB_ID: '54321',
    };

    const env = require('../environment');
    expect(env).toEqual({ id: 'travis', buildId: '12345', jobId: '54321' });
  });

  test('detects travis', () => {
    process.env = {
      APPVEYOR: 'True',
      APPVEYOR_BUILD_ID: '6d8442adc6ead41c4118',
      APPVEYOR_JOB_ID: 'c5d4d0c1c430cde5b291',
    };

    const env = require('../environment');
    expect(env).toEqual({
      id: 'appveyor',
      buildId: '6d8442adc6ead41c4118',
      jobId: 'c5d4d0c1c430cde5b291',
    });
  });
});
