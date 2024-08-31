import { createLogger, format, transports } from 'winston';
import morgan from 'morgan';
import { envVars } from './envVars.config';

const env = envVars.ENV;

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const formatParams = (info: any): string => {
  const { timestamp, level, message, ...args } = info;
  const ts = timestamp.slice(0, 19).replace('T', ' ');

  return `${ts} ${level}:${message} ${Object.keys(args).length ? JSON.stringify(args) : ''}`;
};

const Format = format.combine(
  format.colorize(),
  format.timestamp(),
  format.align(),
  format.printf(formatParams),
);

const transportArray =
  env === 'production'
    ? [
        new transports.File({
          filename: 'TS-funOlympics.log',
          level: 'info',
        }),
      ]
    : [new transports.Console()];

const logger = createLogger({
  level: 'info',
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
