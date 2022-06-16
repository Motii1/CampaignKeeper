import request from 'supertest';
import { App } from '../../Application/App/App';
import { TOKEN_COOKIE_NAME } from '../../Application/AppConstants';
import { MOCKED_AUTH_TOKEN } from './Token';

export const makeAuthorizedTestRequest = (
  app: App,
  url: string,
  requestTypeKey: 'post' | 'get' | 'delete' | 'put' | 'patch'
) =>
  request(app.getRouter())
    [requestTypeKey](url)
    .set('Cookie', `${TOKEN_COOKIE_NAME}=${MOCKED_AUTH_TOKEN}`);
