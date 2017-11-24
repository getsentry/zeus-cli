const requireDir = require('require-dir');
const logger = require('./logger');

function getEnvironment() {
  logger.debug('Initializing CI environment');

  const environments = requireDir('./environments');
  logger.debug(`Found environments: ${Object.keys(environments)}`);

  const environment = Object.keys(environments)
    .map(key => environments[key])
    .find(env => env);

  if (environment) {
    logger.debug(`Environment detected: ${environment.id}`);
  } else {
    logger.debug('No supported CI system detected');
  }

  return environment || {};
}

module.exports = getEnvironment();
