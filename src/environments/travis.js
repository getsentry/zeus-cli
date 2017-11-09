module.exports = process.env.TRAVIS === 'true' && {
  CI_SYSTEM: 'travis',
  BUILD_ID: process.env.TRAVIS_BUILD_ID,
  JOB_ID: process.env.TRAVIS_JOB_ID
};
