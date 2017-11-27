'use strict';

require('dotenv').config();
const logger = require('./logger');

/* eslint-disable no-unused-expressions */
require('yargs')
  .commandDir('commands')
  .demandCommand()
  .option('url', {
    description: 'Fully qualified URL to the Zeus server',
    type: 'string',
  })
  .option('token', {
    description: 'Token for authorized access to Zeus',
    type: 'string',
  })
  .version()
  .alias('v', 'version')
  .help()
  .alias('h', 'help')
  .completion()
  .fail((message, _, yargs) => {
    logger.error(`${message}\n`);
    yargs.showHelp();
  }).argv;
