'use strict';

module.exports = {
  command: ['build <command>', 'b'],
  description: 'Manipulate builds',

  builder: /* istanbul ignore next */ yargs =>
    yargs
      .option('number', {
        description: 'Build ID',
        type: 'number',
        alias: 'n',
      })
      .demandOption(['number'])
      .commandDir('build_cmds'),
};
