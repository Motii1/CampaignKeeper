import { App, ControllerWithRoute } from './Application/App/App';
import { OpsController } from './Application/Controller/OpsController/OpsController';
import { Server } from './Server';

const controllers: ControllerWithRoute[] = [['/ops', new OpsController()]];

const app = new App(controllers);
const server = new Server(app);

server.run();
