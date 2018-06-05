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
        description: 'Build label to use instead of commit message',
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
    zeus.addJob({
      number: argv.number || env.jobId,
      build: argv.build,
      label: argv.label,
      url: argv.url,
    });
  },
};
