'use strict';

module.exports = process.env.BUILDKITE === 'true' && {
  id: 'buildkite',
  buildId: process.env.BUILDKITE_BUILD_ID,
  jobId: process.env.BUILDKITE_JOB_ID,
  commitId: process.env.BUILDKITE_COMMIT,
  url: process.env.BUILDKITE_BUILD_URL || undefined,
};
