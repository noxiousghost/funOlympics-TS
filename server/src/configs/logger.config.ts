import { createLogger, format, transports } from 'winston';
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
export default logger;
