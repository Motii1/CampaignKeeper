import { App, ControllerWithRoute } from './Application/App/App';
import { AuthController } from './Application/Controller/AuthController/AuthController';
import { CampaignController } from './Application/Controller/CampaignController/CampaignController';
import { EventController } from './Application/Controller/EventController/EventController';
import { ObjectController } from './Application/Controller/ObjectController/ObjectController';
import { OpsController } from './Application/Controller/OpsController/OpsController';
import { SchemaContoller } from './Application/Controller/SchemaController/SchemaController';
import { SessionContoller } from './Application/Controller/SessionController/SessionController';
import { UserController } from './Application/Controller/UserController/UserController';
import { Server } from './Server';

const controllers: ControllerWithRoute[] = [
  ['/ops', new OpsController()],
  ['/auth', new AuthController()],
  ['/user', new UserController()],
  ['/campaign', new CampaignController()],
  ['/session', new SessionContoller()],
  ['/schema', new SchemaContoller()],
  ['/object', new ObjectController()],
  ['/event', new EventController()],
];

const app = new App(controllers);
const server = new Server(app);

(async () => {
  await server.run();
})();
