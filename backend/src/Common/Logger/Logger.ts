import { createLogger, format, transports } from 'winston';

const standardTransports = [
  new transports.File({
    filename: '../../logs/errors.log',
    level: 'error',
  }),
  new transports.File({
    filename: '../../logs/warn.log',
    level: 'warn',
  }),
  new transports.File({
    filename: '../../logs/info.log',
    level: 'info',
  }),
  new transports.File({
    filename: '../../logs/http.log',
    level: 'http',
  }),
  new transports.File({
    filename: '../../logs/verbose.log',
    level: 'verbose',
  }),
  new transports.File({
    filename: '../../logs/debug.log',
    level: 'debug',
  }),
  new transports.File({
    filename: '../../logs/all.log',
    level: 'silly',
  }),
  new transports.Console({
    level: 'debug',
  }),
];

// standard logger
export const logger = createLogger({
  format: format.simple(),
  transports: standardTransports,
});
