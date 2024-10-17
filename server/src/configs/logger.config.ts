import { createLogger, format, transports, addColors } from 'winston';
import { envVars } from './envVars.config';
import morgan from 'morgan';

const env = envVars.ENV;

// Define your severity levels.
// With them, You can create log files,
// see or hide levels based on the running ENV.
const levels = {
  error: 0,
  warn: 1,
  info: 2,
  http: 3,
  debug: 4,
};

// This method set the current severity based on
// the current NODE_ENV: show all the log levels
// if the server was run in development mode; otherwise,
// if it was run in production, show only warn and error messages.
const level = () => {
  const env = process.env.NODE_ENV || 'development';
  const isDevelopment = env === 'development';
  return isDevelopment ? 'debug' : 'warn';
};

// Define different colors for each level.
// Colors make the log message more visible,
// adding the ability to focus or ignore messages.
const colors = {
  error: 'red',
  warn: 'yellow',
  info: 'green',
  http: 'magenta',
  debug: 'white',
};

// Tell winston that you want to link the colors
// defined above to the severity levels.
addColors(colors);

// Chose the aspect of your log customizing the log format.
const Format = format.combine(
  // Add the message timestamp with the preferred format
  format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
  // Tell Winston that the logs must be colored
  format.colorize({ all: true }),
  // Define the format of the message showing the timestamp, the level and the message
  format.printf((info) => `${info.timestamp} ${info.level}: ${info.message}`),
);

// Define which transports the logger must use to print out messages.
const transportArray =
  env === 'production'
    ? [
        // Allow to print all the error messages inside the log file in production
        new transports.File({
          filename: 'logs/errors.log',
          level: 'error',
        }),
        // Allow to print all the error message inside the all.log file
        // (also the error log that are also printed inside the error.log(
        new transports.File({ filename: 'logs/all.log' }),
      ]
    : [
        // Allow the use the console to print the messages when in development
        new transports.Console(),
      ];

// Create the logger instance that has to be exported
// and used to log messages.
const logger = createLogger({
  level: level(),
  levels,
  format: Format,
  transports: transportArray,
});
/*
By setting the log level to info, 
the logger will capture and log messages that are categorized as info, warn, and error, 
but it will ignore messages that are less severe, such as debug, verbose, and silly.
*/

const morganMiddleware = () => {
  const morganFormat = ':method :url :status :response-time ms';

  return morgan(morganFormat, {
    stream: {
      write: (message: string) => {
        const logObject = {
          method: message.split(' ')[0],
          url: message.split(' ')[1],
          status: message.split(' ')[2],
          responseTime: message.split(' ')[3],
        };
        logger.info(JSON.stringify(logObject));
      },
    },
  });
};

export { logger, morganMiddleware };
