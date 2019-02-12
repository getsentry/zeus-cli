'use strict';

module.exports = process.env.CIRCLECI === 'true' && {
  id: 'circleci',
  buildId: process.env.CIRCLE_WORKFLOW_ID,
  jobId: process.env.CIRCLE_BUILD_NUM,
  jobLabel: process.env.CIRCLE_JOB,
  commitId: process.env.CIRCLE_SHA1,
  url: process.env.CIRCLE_BUILD_URL,
};
