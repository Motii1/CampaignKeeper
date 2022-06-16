import request from 'supertest';
import { insertMockedCampaign } from '../../../../Common/Test/Campaign';
import { dropDb, initDb } from '../../../../Common/Test/Database';
import { insertMockedSession, MOCKED_SESSION_ID } from '../../../../Common/Test/Session';
import { insertMockedUser, MOCKED_AUTH_TOKEN } from '../../../../Common/Test/Token';
import { App } from '../../../App/App';
import { TOKEN_COOKIE_NAME } from '../../../AppConstants';
import { EventController, EventRoutes } from '../EventController';

const BASE_ENDPOINT = '/api/event';
const testApp = new App([['/event', new EventController()]]);

describe('EventController', () => {
  beforeEach(async () => {
    await initDb();
    await insertMockedUser();
    await insertMockedCampaign();
    await insertMockedSession();
  });
  afterEach(async () => await dropDb());

  it('should get empty graph for defined session', async () => {
    const response = await request(testApp.getRouter())
      .get(`${BASE_ENDPOINT}/${EventRoutes.Graph}/${MOCKED_SESSION_ID}`)
      .set('Cookie', `${TOKEN_COOKIE_NAME}=${MOCKED_AUTH_TOKEN}`);

    expect(response.status).toEqual(200);
    expect(response.body).toStrictEqual({ events: [] });
  });
});
