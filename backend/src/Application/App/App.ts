import compression from 'compression';
import cors from 'cors';
import express, { Express } from 'express';
import helmet from 'helmet';
import { httpLogger } from '../../Common/Logger/HtttpLogger';
import { logger } from '../../Common/Logger/Logger';
import { config } from '../Config/Config';
import { IController } from '../Controller/IController';
import { IApp } from './IApp';

export class App implements IApp {
  private app: Express;

  constructor(private readonly controllers: ControllerWithRoute[]) {
    this.app = express();
    this.configureApp();
  }

  start(): void {
    this.app.listen(config.port, () => {
      logger.info(`Application is listening on port: ${config.port}`);
    });
  }

  private addHttpLogger(): void {
    this.app.use((req, _res, next) => {
      httpLogger.http(req);
      next();
    });
  }

  private configureApp(): void {
    this.app.use(helmet());
    this.app.use(cors());
    this.app.use(compression());
    this.addHttpLogger();

    this.configureRouting();
  }

  private configureRouting(): void {
    this.controllers.forEach(([route, controller]) => {
      this.app.use(route, controller.getRouter());
    });
  }

  public getRouter(): Express {
    return this.app;
  }
}

export type ControllerWithRoute = [string, IController];
