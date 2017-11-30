'use strict';

const fs = require('fs');
const env = require('../environment');
const logger = require('../logger');
const Zeus = require('../sdk');

module.exports = {
  command: ['upload <file>', 'u'],
  description: 'Upload a build artifact',

  builder: /* istanbul ignore next */ yargs =>
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

  handler: argv => {
    const zeus = new Zeus({ url: argv.url, token: argv.token, logger });
    const promise = !fs.existsSync(argv.file)
      ? Promise.reject(new Error(`File does not exist: ${argv.file}`))
      : zeus.uploadArtifact({
          build: argv.build || env.buildId,
          job: argv.job || env.jobId,
          file: fs.createReadStream(argv.file),
          type: argv.type,
        });

    return promise
      .then(result => {
        logger.info('Artifact upload completed');
        logger.info(`URL: ${zeus.getUrl(result.download_url)}`);
      })
      .catch(e => {
        logger.error(`Artifact upload failed: ${e.message}`);
        process.exitCode = 1;
      });
  },
};
