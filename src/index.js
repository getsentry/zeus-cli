#!/usr/bin/env node
/* eslint-disable no-unused-expressions */

const logger = require('./logger');

require('yargs')
  .commandDir('commands')
  .demandCommand()
  .version()
  .alias('v', 'version')
  .help()
  .alias('h', 'help')
  .completion()
  .fail((message, _, yargs) => {
    logger.error(`${message}\n`);
    yargs.showHelp();
  }).argv;
