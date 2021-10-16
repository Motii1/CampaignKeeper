import { Format } from 'logform';
import winston, { createLogger, format, transports } from 'winston';
import { config } from '../../Application/Config/Config';
class Logger {
  private logger: winston.Logger;
  private loggerWithTransportToFile: winston.Logger;
  private loggerFormat: Format;
  private loggerWithTransportToFileFormat: Format;

  constructor() {
    this.loggerFormat = format.combine(
      format.colorize(),
      format.timestamp({
        format: 'YYYY-MM-DD HH:mm:ss',
      }),
      format.printf(info => `${info.timestamp} ${info.level}: ${info.message}`)
    );
    this.loggerWithTransportToFileFormat = format.combine(
      format.timestamp({
        format: 'YYYY-MM-DD HH:mm:ss',
      }),
      format.printf(info => `${info.timestamp} ${info.level}: ${info.message}`)
    );

    this.logger = createLogger({
      format: this.loggerFormat,
      transports: [
        new transports.Console({
          level: 'debug',
        }),
      ],
    });
    this.loggerWithTransportToFile = createLogger({
      format: this.loggerWithTransportToFileFormat,
      transports: [
        new transports.File({
          filename: `${config.logsPath}/combined.logs`,
          maxsize: 5242880,
          maxFiles: 5,
          level: 'http',
        }),
        new transports.Console({
          level: 'debug',
        }),
      ],
    });
  }

  error(message: string, saveToFile = false): void {
    if (saveToFile) this.loggerWithTransportToFile.log('error', message);
    else this.logger.log('error', message);
  }

  fatal(message: string, saveToFile = false): void {
    if (saveToFile) this.loggerWithTransportToFile.log('warn', message);
    else this.logger.log('warn', message);
  }

  info(message: string, saveToFile = false): void {
    if (saveToFile) this.loggerWithTransportToFile.log('info', message);
    else this.logger.log('info', message);
  }

  http(message: string, saveToFile = false): void {
    if (saveToFile) this.loggerWithTransportToFile.log('http', message);
    else this.logger.log('http', message);
  }

  debug(message: string, saveToFile = false): void {
    if (saveToFile) this.loggerWithTransportToFile.log('debug', message);
    else this.logger.log('debug', message);
  }
}

export const logger = new Logger();
