import { createLogger, format, transports } from 'winston';

const httpFormat = format.printf(req => `${format.timestamp()} ${req.ip} ${req.baseUrl}`);

export const httpLogger = createLogger({
  format: httpFormat,
  transports: new transports.File({
    filename: '../../logs/httpOnly.log',
    level: 'http',
  }),
});
