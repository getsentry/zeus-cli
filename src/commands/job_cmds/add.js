'use strict';

const env = require('../../environment');
const logger = require('../../logger');
const Zeus = require('../../sdk');

module.exports = {
  command: ['add', 'a'],
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
      }),

  handler: argv => {
    const zeus = new Zeus({ url: argv.url, token: argv.token, logger });
    const promise = zeus.addJob({
      job: argv.job || env.jobId,
      build: argv.build || env.buildId,
      ref: argv.ref || env.commitId,
      job_label: argv['job-label'],
      build_label: argv['build-label'],
      url: argv.url,
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
