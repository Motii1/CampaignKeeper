import { insertMockedCampaign } from '../../../../Common/Test/Campaign';
import { dropDb, initDb } from '../../../../Common/Test/Database';
import { makeAuthorizedTestRequest } from '../../../../Common/Test/Request';
import { insertMockedSession } from '../../../../Common/Test/Session';
import { insertMockedUser } from '../../../../Common/Test/Token';
import { EventInsertDto } from '../Dto/EventInsertDto';
import {
  BASE_ENDPOINT,
  createGraphRoot,
  insertEvent,
  MOCKED_EVENT_INSERT_BASE,
  MOCKED_ROOT_ID,
  readGraph,
  testApp,
} from './common';

describe('EventController', () => {
  beforeEach(async () => {
    await initDb();
    await insertMockedUser();
    await insertMockedCampaign();
    await insertMockedSession();
  });
  afterEach(async () => await dropDb());

  it('should get empty graph for defined session', async () => {
    const response = await readGraph();

    expect(response.status).toEqual(200);
    expect(response.body).toStrictEqual({ events: [] });
  });

  it('should add root event to session graph', async () => {
    const response = await insertEvent(MOCKED_EVENT_INSERT_BASE);
    expect(response.status).toEqual(200);
    expect(response.body).toEqual(expect.objectContaining(MOCKED_EVENT_INSERT_BASE));

    const graphResponse = await readGraph();
    expect(graphResponse.status).toEqual(200);
    expect(graphResponse.body.events).toEqual(
      expect.arrayContaining([expect.objectContaining(MOCKED_EVENT_INSERT_BASE)])
    );
  });

  it('should read event by id', async () => {
    const root = await createGraphRoot();
    const response = await makeAuthorizedTestRequest(testApp, `${BASE_ENDPOINT}/${root.id}`, 'get');
    expect(response.status).toEqual(200);
    expect(response.body).toStrictEqual(root);
  });

  it('should add root event child to session graph', async () => {
    await createGraphRoot();
    const body: EventInsertDto = {
      ...MOCKED_EVENT_INSERT_BASE,
      parentIds: [MOCKED_ROOT_ID],
    };
    const response = await insertEvent(body);
    expect(response.status).toEqual(200);
    expect(response.body).toEqual(expect.objectContaining(body));

    const graphResponse = await readGraph();
    expect(graphResponse.status).toEqual(200);
    expect(graphResponse.body.events).toEqual(
      expect.arrayContaining([
        expect.objectContaining(MOCKED_EVENT_INSERT_BASE),
        expect.objectContaining(body),
      ])
    );
  });
});
