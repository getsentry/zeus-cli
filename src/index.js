/* eslint-disable no-unused-expressions */

require('yargs')
  .commandDir('commands')
  .demandCommand()
  .help().argv;
