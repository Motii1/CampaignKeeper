import winston from 'winston';

const transports = [
  new winston.transports.File({
    filename: '../../logs/errors.log',
    level: 'error',
  }),
  new winston.transports.File({
    filename: '../../logs/warn.log',
    level: 'warn',
  }),
  new winston.transports.File({
    filename: '../../logs/info.log',
    level: 'info',
  }),
  new winston.transports.File({
    filename: '../../logs/http.log',
    level: 'http',
  }),
  new winston.transports.File({
    filename: '../../logs/verbose.log',
    level: 'verbose',
  }),
  new winston.transports.File({
    filename: '../../logs/debug.log',
    level: 'debug',
  }),
  new winston.transports.File({
    filename: '../../logs/silly.log',
    level: 'silly',
  }),
];

export const logger = winston.createLogger({
  format: winston.format.json(),
  transports: transports,
});
