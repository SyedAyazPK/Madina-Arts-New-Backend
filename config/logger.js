"use strict";

const winston = require("winston");
const isProduction = "_production" === process.env.NODE_ENV;

const colorize = winston.format.colorize({ all: true });
const label = winston.format.label({ label: "EDUPORTAL API" });
const timestamp = winston.format.timestamp({
  format: "YYYY-MM-DD HH:mm:ss.ms",
});

const logOptions = isProduction
  ? [label, timestamp]
  : [colorize, label, timestamp];

const logFormat = winston.format.printf(
  ({ level, message, label, timestamp, fileName, stack }) => {
    if (isProduction) {
      return JSON.stringify({
        timestamp,
        label,
        level,
        fileName,
        message,
        stack,
      });
    }
    return [timestamp, label, level, fileName, message, stack]
      .filter(Boolean)
      .join(" | ");
  }
);

// instantiate a new Winston Logger with the settings defined above
const logger = winston.createLogger({
  format: winston.format.combine(...logOptions, logFormat),
  transports: [new winston.transports.Console()],
  exitOnError: false, // do not exit on handled exceptions
});

// create a stream object with a 'write' function that will be used by `morgan`
logger.stream = {
  write: function (message, encoding) {
    // use the 'info' log level so the output will be picked up by both transports (file and console)
    logger.info(message);
  },
};

module.exports = function (name) {
  // set the default fileName of the child
  return logger.child({ fileName: name });
};

module.exports=logger;