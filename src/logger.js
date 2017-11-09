const winston = require('winston');

const logger = new winston.Logger({
  level: process.env.LOG_LEVEL || 'info',
  transports: [new winston.transports.Console()]
});

logger.cli();
module.exports = logger;
