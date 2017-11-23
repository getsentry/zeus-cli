module.exports = process.env.TRAVIS === 'true' && {
  id: 'travis',
  buildId: process.env.TRAVIS_BUILD_ID,
  jobId: process.env.TRAVIS_JOB_ID,
};
