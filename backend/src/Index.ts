import { App, ControllerWithRoute } from './Application/App/App';
import { AuthController } from './Application/Controller/AuthController/AuthController';
import { CampaignController } from './Application/Controller/CampaignController/CampaignController';
import { OpsController } from './Application/Controller/OpsController/OpsController';
import { UserController } from './Application/Controller/UserController/UserController';
import { Server } from './Server';

const controllers: ControllerWithRoute[] = [
  ['/ops', new OpsController()],
  ['/auth', new AuthController()],
  ['/user', new UserController()],
  ['/campaign', new CampaignController()],
];

const app = new App(controllers);
const server = new Server(app);

(async () => {
  await server.run();
})();
