const requireDir = require('require-dir');

function getEnvironment() {
  const hookBase = process.env.HOOK_BASE;
  if (!hookBase) {
    console.error('ERROR: Missing ZEUS_HOOK_BASE environment variable');
    process.exit(1);
  }

  const environments = requireDir('environments');
  const environment = Object.values(environments).find(env => env);
  if (!environment) {
    console.error('ERROR: No supported CI system detected');
    process.exit(1);
  }

  environment.HOOK_BASE = hookBase;
  return environment;
}

module.exports = getEnvironment();
