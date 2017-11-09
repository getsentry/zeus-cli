#!/usr/bin/env node
/* eslint-disable no-unused-expressions */

require('yargs')
  .commandDir('commands')
  .demandCommand()
  .version()
  .alias('v', 'version')
  .help()
  .alias('h', 'help').argv;
