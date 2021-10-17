import { Format } from 'logform';
import winston, { createLogger, format, transports } from 'winston';
import { config } from '../../Application/Config/Config';
class Logger {
  private consoleLogger: winston.Logger;
  private consoleAndFileLogger: winston.Logger;
  private consoleLoggerFormat: Format;
  private consoleAndFileLoggerFormat: Format;

  constructor() {
    this.consoleLoggerFormat = format.combine(
      format.colorize(),
      format.timestamp({
        format: 'YYYY-MM-DD HH:mm:ss',
      }),
      format.printf(info => `${info.timestamp} ${info.level}: ${info.message}`)
    );
    this.consoleLogger = createLogger({
      format: this.consoleLoggerFormat,
      transports: [
        new transports.Console({
          level: 'debug',
        }),
      ],
    });

    this.consoleAndFileLoggerFormat = format.combine(
      format.timestamp({
        format: 'YYYY-MM-DD HH:mm:ss',
      }),
      format.printf(info => `${info.timestamp} ${info.level}: ${info.message}`)
    );
    this.consoleAndFileLogger = createLogger({
      format: this.consoleAndFileLoggerFormat,
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
    if (saveToFile) this.consoleAndFileLogger.log('error', message);
    else this.consoleLogger.log('error', message);
  }

  fatal(message: string, saveToFile = false): void {
    if (saveToFile) this.consoleAndFileLogger.log('warn', message);
    else this.consoleLogger.log('warn', message);
  }

  info(message: string, saveToFile = false): void {
    if (saveToFile) this.consoleAndFileLogger.log('info', message);
    else this.consoleLogger.log('info', message);
  }

  http(message: string, saveToFile = false): void {
    if (saveToFile) this.consoleAndFileLogger.log('http', message);
    else this.consoleLogger.log('http', message);
  }

  debug(message: string): void {
    this.consoleLogger.log('debug', message);
  }
}

export const logger = new Logger();
