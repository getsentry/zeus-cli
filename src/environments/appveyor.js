'use strict';

module.exports = process.env.APPVEYOR === 'True' && {
  id: 'appveyor',
  buildId: process.env.APPVEYOR_BUILD_ID,
  jobId: process.env.APPVEYOR_JOB_ID,
  commitId: process.env.APPVEYOR_REPO_COMMIT,
};
