'use strict';

module.exports = {
  command: ['job <command>', 'j'],
  description: 'Manipulate jobs',

  builder: /* istanbul ignore next */ yargs =>
    yargs
      .option('number', {
        description: 'Job ID',
        type: 'number',
        alias: 'n',
      })
      .option('build', {
        description: 'Build ID',
        type: 'number',
        alias: 'b',
      })
      .demandOption(['number', 'build'])
      .commandDir('job_cmds'),
};
