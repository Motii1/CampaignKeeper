import 'reflect-metadata';
import { createConnection } from 'typeorm';
import { IApp } from './Application/App/IApp';
import { logger } from './Common/Logger/Logger';

export class Server {
  constructor(private readonly app: IApp) {}

  async run(): Promise<void> {
    await createConnection();
    logger.info('Established database connection');
    this.app.start();
  }
}
