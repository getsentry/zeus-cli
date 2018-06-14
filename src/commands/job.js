'use strict';

module.exports = {
  command: ['job <command>', 'j'],
  description: 'Manipulate jobs',

  builder: /* istanbul ignore next */ yargs =>
    yargs
      .option('job', {
        description: 'Job id',
        type: 'string',
        alias: 'j',
      })
      .option('build', {
        description: 'Build id',
        type: 'string',
        alias: 'b',
      })
      .required(1)
      .commandDir('job_cmds'),
};
