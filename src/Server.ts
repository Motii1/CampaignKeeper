import { IApp } from './Application/App/IApp';

export class Server {
  constructor(private readonly app: IApp) {}

  run(): void {
    this.app.start();
  }
}
