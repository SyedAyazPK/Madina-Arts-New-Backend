'use strict'
const winston = require('winston');
module.exports.logger =  winston.createLogger({
  transports: [
    new winston.transports.File({
      level: 'info',
      filename: 'filelog-info.log',
      json: true,
      format: winston.format.combine(winston.format.timestamp(), winston.format.json())
    }),
    new winston.transports.File({
      level: 'error',
      filename: 'filelog-error.log',
      json: true,
      format: winston.format.combine(winston.format.timestamp(), winston.format.json())
    })
  ]
});

