module.exports = {
  // How many times we attempt to upload artifacts
  UPLOAD_RETRY_ATTEMPTS: 3,
  // How long we wait before the next upload retry (in milliseconds)
  UPLOAD_RETRY_TIMEOUT: 10000,
  // Uploads will be retried if we get these responses
  UPLOAD_RETRY_RESPONSES: ['502 Bad Gateway', 'internal server error'],
};
