'use strict';

function getJobUrl() {
  const e = {};
  const checkVars = [
    'APPVEYOR_URL',
    'APPVEYOR_ACCOUNT_NAME',
    'APPVEYOR_PROJECT_SLUG',
    'APPVEYOR_BUILD_VERSION',
    'APPVEYOR_JOB_ID',
  ];

  // Return if any of those environment value is empty
  for (let i = 0; i < checkVars.length; i += 1) {
    const key = checkVars[i];
    if (!process.env[key]) {
      return '';
    }
    e[key] = process.env[key];
  }

  const url =
    `${e.APPVEYOR_URL}` +
    `/project/${e.APPVEYOR_ACCOUNT_NAME}/${e.APPVEYOR_PROJECT_SLUG}` +
    `/build/${e.APPVEYOR_BUILD_VERSION}` +
    `/job/${e.APPVEYOR_JOB_ID}`;
  return url;
}

module.exports = process.env.APPVEYOR === 'True' && {
  id: 'appveyor',
  buildId: process.env.APPVEYOR_BUILD_ID,
  jobId: process.env.APPVEYOR_JOB_ID,
  commitId: process.env.APPVEYOR_REPO_COMMIT,
  buildLabel: process.env.APPVEYOR_PULL_REQUEST_TITLE || undefined,
  jobLabel: process.env.APPVEYOR_JOB_NAME || undefined,
  url: getJobUrl() || undefined,
};
