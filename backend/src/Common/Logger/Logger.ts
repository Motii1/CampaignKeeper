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
          level: config.consoleLoggingLevel,
        }),
      ],
    });
  }

  private logMessage(message: string, level: string, saveToFile: boolean): void {
    if (saveToFile) this.consoleAndFileLogger.log(level, message);
    else this.consoleLogger.log(level, message);
  }

  error(message: string, saveToFile = false): void {
    this.logMessage(message, 'error', saveToFile);
  }

  warn(message: string, saveToFile = false): void {
    this.logMessage(message, 'warn', saveToFile);
  }

  info(message: string, saveToFile = false): void {
    this.logMessage(message, 'info', saveToFile);
  }

  http(message: string, saveToFile = false): void {
    this.logMessage(message, 'http', saveToFile);
  }

  debug(message: string, saveToFile = false): void {
    this.logMessage(message, 'debug', saveToFile);
  }
}

export const logger = new Logger();
