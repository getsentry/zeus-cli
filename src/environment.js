'use strict';

const requireDir = require('require-directory');
const logger = require('./logger');

const REQUIRE_OPTS = { recurse: false };

function getEnvironment() {
  logger.debug('Initializing CI environment');

  const environments = requireDir(module, './environments', REQUIRE_OPTS);
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
