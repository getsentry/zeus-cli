'use strict';

function isAzureEnv() {
  return !!(
    process.env.TF_BUILD &&
    process.env.SYSTEM_TEAMPROJECTID &&
    process.env.SYSTEM_JOBID
  );
}

function getBuildUrl() {
  if (
    process.env.SYSTEM_COLLECTIONURI &&
    process.env.SYSTEM_TEAMPROJECT &&
    process.env.BUILD_BUILDID
  ) {
    return `${process.env.SYSTEM_COLLECTIONURI}${
      process.env.SYSTEM_TEAMPROJECT
    }/_build/results?buildId=${process.env.BUILD_BUILDID}`;
  }
  return '';
}

module.exports = isAzureEnv() && {
  id: 'azurePipelines',
  buildId: `${process.env.SYSTEM_TEAMPROJECTID}__${process.env.BUILD_BUILDID}`,
  jobId: process.env.SYSTEM_JOBID,
  jobLabel: process.env.SYSTEM_PHASEDISPLAYNAME,
  commitId: process.env.BUILD_SOURCEVERSION,
  url: getBuildUrl() || undefined, // Use build URL for now
};
