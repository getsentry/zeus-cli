'use strict';

const getEnv = require('../../environment').getEnvironment;
const logger = require('../../logger');
const zeusSdk = require('@zeus-ci/sdk');

const Zeus = zeusSdk.Client;

module.exports = {
  command: ['update', 'u'],
  description: 'Add/update a job',

  builder: /* istanbul ignore next */ yargs =>
    yargs
      .option('url', {
        description: 'Custom URL',
        type: 'string',
        alias: 'u',
      })
      .option('ref', {
        description: 'Commit hash',
        type: 'string',
        alias: 'r',
      })
      .option('build-label', {
        description: 'Custom build label',
        type: 'string',
        alias: 'B',
      })
      .option('job-label', {
        description: 'Custom job label',
        type: 'string',
        alias: 'J',
      })
      .option('status', {
        description: 'Job execution status',
        type: 'string',
        choices: Object.values(Zeus.JOB_STATUSES),
        alias: 's',
      }),

  handler: argv => {
    const zeus = new Zeus({ url: argv.url, token: argv.token, logger });
    const env = getEnv();

    const params = {
      job: argv.job || env.jobId,
      build: argv.build || env.buildId,
      ref: argv.ref || env.commitId,
      jobLabel: argv['job-label'] || env.jobLabel,
      buildLabel: argv['build-label'] || env.buildLabel,
      url: argv.url || env.url,
      status: argv.status,
    };

    return zeus
      .createOrUpdateBuild(params)
      .then(() => zeus.createOrUpdateJob(params))
      .then(() => {
        logger.info('Job updated');
      })
      .catch(e => {
        logger.error(`Job update failed: ${e.message}`);
        process.exitCode = 1;
      });
  },
};
