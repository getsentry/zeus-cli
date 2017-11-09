const { createReadStream, existsSync } = require('fs');
const { basename } = require('path');
const request = require('request');
const logger = require('../logger');

module.exports = {
  command: ['upload <file> [type]', 'u'],
  description: 'Upload a build artifact',

  builder: yargs =>
    yargs
      .positional('file', {
        description: 'Path to the artifact',
        type: 'string'
      })
      .positional('type', {
        description: 'Mime type of the file to upload',
        type: 'string'
      }),

  handler: argv => {
    const env = require('../environment'); // eslint-disable-line global-require

    if (!existsSync(argv.file)) {
      logger.error(`File does not exist: ${argv.file}`);
      process.exit(1);
    }

    logger.debug(`Artifact found at ${argv.file}`);

    const url = `${env.HOOK_BASE}/builds/${env.BUILD_ID}/jobs/${env.JOB_ID}/artifacts`;
    logger.debug(`Requesting build artifacts for job ${env.JOB_ID}`);
    logger.debug(`Request URL: ${url}`);

    const formData = {
      type: argv.type,
      file: {
        value: createReadStream(argv.file),
        options: {
          filename: basename(argv.file)
        }
      }
    };

    request.post({ url, formData }, err => {
      if (err) {
        logger.error('Artifact upload failed: ', err);
        process.exit(1);
      }

      logger.info('Artifact upload completed');
    });
  }
};
