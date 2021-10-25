import { App, ControllerWithRoute } from './Application/App/App';
import { AuthController } from './Application/Controller/AuthController/AuthController';
import { OpsController } from './Application/Controller/OpsController/OpsController';
import { Server } from './Server';

const controllers: ControllerWithRoute[] = [
  ['/ops', new OpsController()],
  ['/auth', new AuthController()],
];

const app = new App(controllers);
const server = new Server(app);

(async () => {
  await server.run();
})();
