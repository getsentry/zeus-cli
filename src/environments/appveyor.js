module.exports = process.env.APPVEYOR === 'True' && {
  CI_SYSTEM: 'appveyor',
  BUILD_ID: process.env.APPVEYOR_BUILD_ID,
  JOB_ID: process.env.APPVEYOR_JOB_ID,
};
