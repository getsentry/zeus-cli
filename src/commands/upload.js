'use strict';

const fs = require('fs');

const promiseRetry = require('promise-retry');
const zeus = require('@zeus-ci/sdk');

const getEnv = require('../environment').getEnvironment;
const logger = require('../logger');
const constants = require('../constants');

/**
 * Attempts to upload the provided artifacts to Zeus
 *
 * In case of certain failures, the upload will be attempted again after a delay.
 * We pass the factory function instead of an Artifact object, because artifact
 * objects have internal references to read streams, that might be depleted.
 *
 * @param {zeus.Client} client - Zeus client
 * @param {} artifactFactory - The factory that produces Artifact objects
 * @param {number} attempts - The total number of attempts to make in case of failures
 * @returns A promise that resolves when uploading is done
 */
function attemptUploadArtifact(client, artifactFactory, _attempts) {
  // Node 4 compatibility
  const attempts =
    _attempts === undefined ? constants.UPLOAD_RETRY_ATTEMPTS : _attempts;
  return promiseRetry(
    (retry, number) => {
      const artifact = artifactFactory();
      return client.uploadArtifact(artifact).catch(e => {
        if (constants.UPLOAD_RETRY_RESPONSES.indexOf(e.message) > -1) {
          // Output the messages only if it's not the last attempt
          if (number < attempts) {
            logger.error(
              `Upload of artifact "${
                artifact.file.path
              }" failed with the following error: "${e.message}"`
            );
            logger.warn(
              `Retries left: ${attempts -
                number}. Retrying in about ${Math.floor(
                constants.UPLOAD_RETRY_TIMEOUT / 1000.0
              )} seconds...\n`
            );
          }
          retry(e);
        } else {
          throw e;
        }
      });
    },
    {
      retries: attempts - 1,
      minTimeout: constants.UPLOAD_RETRY_TIMEOUT,
      maxTimeout: constants.UPLOAD_RETRY_TIMEOUT * 1.1,
    }
  );
}

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
      })
      .option('R', {
        description: 'Do not retry failed uploads',
        type: 'boolean',
        alias: 'no-retry',
      }),

  handler: argv => {
    logger.debug('Argv:', argv);
    const client = new zeus.Client({
      url: argv.url,
      token: argv.token,
      logger,
    });
    const env = getEnv();
    const uploads = argv.file.map(file => {
      const promise = !fs.existsSync(file)
        ? Promise.reject(new Error(`File does not exist: ${file}`))
        : attemptUploadArtifact(
            client,
            () => ({
              build: argv.build || env.buildId,
              job: argv.job || env.jobId,
              file: fs.createReadStream(file),
              name: argv.name,
              type: argv.type,
            }),
            argv.noRetry ? 1 : constants.UPLOAD_RETRY_ATTEMPTS
          );

      return promise
        .then(result => {
          if (result && result.download_url) {
            const artifactUrl = client.getUrl(result.download_url);
            logger.info('Artifact upload completed');
            logger.info(`URL: ${artifactUrl}`);
          } else {
            throw new Error(`Got invalid result: ${JSON.stringify(result)}`);
          }
        })
        .catch(e => {
          logger.error(`Artifact upload failed: ${e.message}`);
          process.exitCode = 1;
        });
    });

    return Promise.all(uploads);
  },
};
