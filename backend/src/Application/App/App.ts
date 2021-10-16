import compression from 'compression';
import cors from 'cors';
import express, { Express } from 'express';
import helmet from 'helmet';
import morgan from 'morgan';
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
      logger.info(`Application is listening on port: ${config.port}`, true);
    });
  }

  private configureApp(): void {
    this.app.use(helmet());
    this.app.use(cors());
    this.app.use(compression());
    this.app.use(morgan('dev'));

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
