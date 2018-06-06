'use strict';

const env = require('../../environment');
const logger = require('../../logger');
const Zeus = require('../../sdk');

module.exports = {
  command: ['add', 'a'],
  description: 'Add/update a job',

  builder: /* istanbul ignore next */ yargs =>
    yargs
      .option('label', {
        description: 'Job label',
        type: 'string',
        alias: 'l',
      })
      .option('url', {
        description: 'Custom URL',
        type: 'string',
        alias: 'u',
      }),

  handler: argv => {
    const zeus = new Zeus({ url: argv.url, token: argv.token, logger });
    const promise = zeus.addJob({
      number: argv.number || env.jobId,
      build: argv.build,
      label: argv.label,
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
