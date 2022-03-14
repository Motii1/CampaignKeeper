import compression from 'compression';
import cookieParser from 'cookie-parser';
import cors from 'cors';
import express, { Express } from 'express';
import helmet from 'helmet';
import morgan from 'morgan';
import { logger } from '../../Common/Logger/Logger';
import { config } from '../Config/Config';
import { IController } from '../Controller/IController';
import { setupDocumentationGenerator } from './Docs';
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
    this.app.use(helmet({ contentSecurityPolicy: false }));
    this.app.use(cors());
    this.app.use(compression());
    this.app.use(morgan('dev'));
    this.app.use(express.json({ limit: '2MB' }));
    this.app.use(express.urlencoded({ extended: true }));
    this.app.use(cookieParser());

    setupDocumentationGenerator(this);
    this.configureRouting();
  }

  private configureRouting(): void {
    this.controllers.forEach(([route, controller]) => {
      this.app.use(`/api${route}`, controller.getRouter());
    });
    this.app.use(express.static(config.frontendBuildPath));
    this.app.get('*', (_, res) => {
      res.sendFile('index.html', { root: config.frontendBuildPath });
    });
  }

  public getRouter(): Express {
    return this.app;
  }
}

export type ControllerWithRoute = [string, IController];
