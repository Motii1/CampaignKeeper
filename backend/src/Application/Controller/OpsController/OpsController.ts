import { Request, Response, Router } from 'express';
import { IController } from '../IController';

export enum OpsRoutes {
  Ping = '/ping',
}

export class OpsController implements IController {
  private router: Router;

  constructor() {
    this.router = Router();
    this.declareRoutes();
  }

  private declareRoutes(): void {
    this.router.get(OpsRoutes.Ping, this.pingHandler);
  }

  private pingHandler(_req: Request, res: Response): void {
    res.status(200).json({});
  }

  getRouter(): Router {
    return this.router;
  }
}
