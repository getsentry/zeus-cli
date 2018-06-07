'use strict';

const env = require('../../environment');
const logger = require('../../logger');
const Zeus = require('../../sdk');

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
        alias: 'bl',
      })
      .option('job-label', {
        description: 'Custom job label',
        type: 'string',
        alias: 'jl',
      })
      .option('status', {
        description: 'Job execution status',
        type: 'string',
        choices: Object.values(Zeus.JOB_STATUSES),
        alias: 's',
      }),

  handler: argv => {
    const zeus = new Zeus({ url: argv.url, token: argv.token, logger });
    const promise = zeus.createOrUpdateJob({
      job: argv.job || env.jobId,
      build: argv.build || env.buildId,
      ref: argv.ref || env.commitId,
      jobLabel: argv['job-label'],
      buildLabel: argv['build-label'],
      url: argv.url,
      status: argv.status,
    });

    return promise
      .then(() => {
        logger.info('Job updated');
      })
      .catch(e => {
        logger.error(`Job update failed: ${e.message}`);
        process.exitCode = 1;
      });
  },
};
