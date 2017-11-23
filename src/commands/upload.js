const { createReadStream, existsSync } = require('fs');
const logger = require('../logger');
const Zeus = require('../zeus');

module.exports = {
  command: ['upload <file>', 'u'],
  description: 'Upload a build artifact',

  builder: yargs =>
    yargs
      .positional('file', {
        description: 'Path to the artifact',
        type: 'string',
      })
      .option('t', {
        description: 'Mime type of the file to upload',
        type: 'string',
        alias: 'type',
      })
      .option('j', {
        description: 'Unique id of the job in CI',
        type: 'string',
        alias: 'job',
      })
      .option('b', {
        description: 'Unique id of the build in CI',
        type: 'string',
        alias: 'build',
      }),

  handler: async argv => {
    try {
      if (!existsSync(argv.file)) {
        throw new Error(`File does not exist: ${argv.file}`);
      }

      const zeus = new Zeus({ url: argv.url, token: argv.token });
      const result = await zeus.uploadArtifact({
        build: argv.build,
        job: argv.job,
        file: createReadStream(argv.file),
        type: argv.type,
      });

      logger.info('Artifact upload completed');
      logger.info(`URL: ${result.download_url}`);
    } catch (e) {
      logger.error(`Artifact upload failed: ${e.message}`);
      process.exit(1);
    }
  },
};
