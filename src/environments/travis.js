'use strict';

// Travis does not have an environment variable that tells you whether you
// build on travis-ci.org or travis-ci.com. We assume that it's travis-ci.org
// by default, and allow to override it with TRAVIS_BASE_URL variable.
const DEFAULT_TRAVIS_BASE_URL = 'https://travis-ci.org';

function getJobUrl() {
  const e = {};
  const checkVars = ['TRAVIS_REPO_SLUG', 'TRAVIS_JOB_ID'];

  // Return if any of those environment value is empty
  for (let i = 0; i < checkVars.length; i += 1) {
    const key = checkVars[i];
    if (!process.env[key]) {
      return '';
    }
    e[key] = process.env[key];
  }

  // Deal with base URL
  e.TRAVIS_URL = process.env.TRAVIS_BASE_URL || DEFAULT_TRAVIS_BASE_URL;
  if (!e.TRAVIS_URL) {
    return '';
  }

  const url = `${e.TRAVIS_URL}/${e.TRAVIS_REPO_SLUG}/jobs/${e.TRAVIS_JOB_ID}`;
  return url;
}

module.exports = process.env.TRAVIS === 'true' && {
  id: 'travis',
  buildId: process.env.TRAVIS_BUILD_ID,
  jobId: process.env.TRAVIS_JOB_ID,
  commitId: process.env.TRAVIS_COMMIT,
  url: getJobUrl() || undefined,
};
