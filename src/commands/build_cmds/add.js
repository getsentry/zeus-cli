'use strict';

const env = require('../../environment');
const logger = require('../../logger');
const Zeus = require('../../sdk');

module.exports = {
  command: ['add', 'a'],
  description: 'Add/update a build',

  builder: /* istanbul ignore next */ yargs =>
    yargs
      .option('label', {
        description: 'Build label to use instead of commit message',
        type: 'string',
        alias: 'l',
      })
      .option('ref', {
        description: 'Git commit hash',
        type: 'string',
        alias: 'r',
      })
      .option('url', {
        description: 'Custom URL',
        type: 'string',
        alias: 'u',
      })
      .demandOption(['ref']),

  handler: argv => {
    const zeus = new Zeus({ url: argv.url, token: argv.token, logger });
    zeus.addBuild({
      number: argv.number || env.buildId,
      label: argv.label,
      ref: argv.ref,
      url: argv.url,
    });
  },
};
