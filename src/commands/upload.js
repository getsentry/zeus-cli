const { createReadStream } = require('fs');
const { basename } = require('path');
const request = require('request');

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
    const url = `${env.HOOK_BASE}/builds/${env.BUILD_ID}/jobs/${env.JOB_ID}/artifacts`;
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
        console.error('Artifact upload failed: ', err);
        process.exit(1);
      }

      console.log('Artifact upload completed');
    });
  }
};
