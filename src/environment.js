const requireDir = require('require-dir');
const logger = require('./logger');

function getEnvironment() {
  logger.debug('Initializing CI environment');

  const hookBase = process.env.HOOK_BASE;
  if (!hookBase) {
    logger.error('Missing ZEUS_HOOK_BASE environment variable');
    process.exit(1);
  }

  const environments = requireDir('environments');
  logger.debug(`Found environments: ${Object.keys(environments)}`);

  const environment = Object.values(environments).find(env => env);
  if (!environment) {
    logger.error('No supported CI system detected');
    process.exit(1);
  }

  logger.debug(`Environment detected: ${environment.CI_SYSTEM}`);
  environment.HOOK_BASE = hookBase;
  return environment;
}

module.exports = getEnvironment();
