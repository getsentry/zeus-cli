#!/usr/bin/env node
require('babel-polyfill');

/* eslint-disable no-unused-expressions */
require('yargs')
  .commandDir('commands')
  .demandCommand()
  .version()
  .alias('v', 'version')
  .help()
  .alias('h', 'help').argv;
