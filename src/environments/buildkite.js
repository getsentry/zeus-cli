'use strict';

module.exports = process.env.BUILDKITE === 'true' && {
  id: 'buildkite',
  buildId: process.env.BUILDKITE_BUILD_ID,
  jobId: process.env.BUILDKITE_JOB_ID,
};
