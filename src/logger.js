const winston = require('winston');

const logger = new winston.Logger({
  level: process.env.LOG_LEVEL || 'warning'
});

logger.cli();
module.exports = logger;
