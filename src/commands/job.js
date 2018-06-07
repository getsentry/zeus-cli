'use strict';

module.exports = {
  command: ['job <command>', 'j'],
  description: 'Manipulate jobs',

  builder: /* istanbul ignore next */ yargs =>
    yargs
      .option('job', {
        description: 'Job id',
        type: 'number',
        alias: 'j',
      })
      .option('build', {
        description: 'Build id',
        type: 'number',
        alias: 'b',
      })
      .required(1)
      .demandOption(['job', 'build'])
      .commandDir('job_cmds'),
};
