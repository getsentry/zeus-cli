'use strict';

function getJobUrl() {
  const e = {};
  const checkVars = ['GITHUB_RUN_ID', 'GITHUB_REPOSITORY'];

  // Return if any of those environment value is empty
  for (let i = 0; i < checkVars.length; i += 1) {
    const key = checkVars[i];
    if (!process.env[key]) {
      return '';
    }
    e[key] = process.env[key];
  }

  return `https://github.com/${e.GITHUB_REPOSITORY}/runs/${e.GITHUB_RUN_ID}`;
}

module.exports = process.env.GITHUB_ACTIONS === 'true' && {
  id: 'github',
  buildId: process.env.GITHUB_ACTION,
  jobId: process.env.GITHUB_RUN_ID,
  commitId: process.env.GITHUB_SHA,
  url: getJobUrl() || undefined,
};
