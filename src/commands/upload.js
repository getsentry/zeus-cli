'use strict';

const fs = require('fs');
const env = require('../environment');
const logger = require('../logger');
const zeus = require('@zeus-ci/sdk');

module.exports = {
  command: ['upload <file...>', 'u'],
  description: 'Upload build artifacts',

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
      .option('n', {
        description: 'Artifact name to use in place of the filename',
        type: 'string',
        alias: 'name',
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
    const client = new zeus.Client({
      url: argv.url,
      token: argv.token,
      logger,
    });
    const uploads = argv.file.map(file => {
      const promise = !fs.existsSync(file)
        ? Promise.reject(new Error(`File does not exist: ${file}`))
        : client.uploadArtifact({
            build: argv.build || env.buildId,
            job: argv.job || env.jobId,
            file: fs.createReadStream(file),
            name: argv.name,
            type: argv.type,
          });

      return promise
        .then(result => {
          const artifactUrl = client.getUrl(result.download_url);
          logger.info('Artifact upload completed');
          logger.info(`URL: ${artifactUrl}`);
        })
        .catch(e => {
          logger.error(`Artifact upload failed: ${e.message}`);
          process.exitCode = 1;
        });
    });

    return Promise.all(uploads);
  },
};
