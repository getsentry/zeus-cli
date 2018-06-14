'use strict';

module.exports = process.env.APPVEYOR === 'True' && {
  id: 'appveyor',
  buildId: process.env.APPVEYOR_BUILD_ID,
  jobId: process.env.APPVEYOR_JOB_ID,
  commitId: process.env.APPVEYOR_REPO_COMMIT,
  buildLabel: process.env.APPVEYOR_PULL_REQUEST_TITLE || undefined,
  jobLabel: process.env.APPVEYOR_JOB_NAME || undefined,
};
