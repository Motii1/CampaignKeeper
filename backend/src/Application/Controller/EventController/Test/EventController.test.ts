import { getConnection } from 'typeorm';
import { insertMockedCampaign } from '../../../../Common/Test/Campaign';
import { dropDb, initDb } from '../../../../Common/Test/Database';
import { makeAuthorizedTestRequest } from '../../../../Common/Test/Request';
import { insertMockedSession } from '../../../../Common/Test/Session';
import { insertMockedUser } from '../../../../Common/Test/Token';
import {
  EventDisplayStatus,
  EventStatus,
  EventType,
} from '../../../../Domain/Campaign/Event/Event';
import { EventInsertDto } from '../Dto/EventInsertDto';
import { EventUpdateDto } from '../Dto/EventUpdateDto';
import {
  BASE_ENDPOINT,
  createGraphRoot,
  deleteEvent,
  insertEvent,
  MOCKED_EVENT_INSERT_BASE,
  MOCKED_ROOT_ID,
  readGraph,
  testApp,
  updateEvent,
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
    const child = response.body;
    expect(child).toEqual(expect.objectContaining(body));

    const graphResponse = await readGraph();
    expect(graphResponse.status).toEqual(200);
    expect(graphResponse.body.events).toEqual(
      expect.arrayContaining([
        expect.objectContaining({ ...MOCKED_EVENT_INSERT_BASE, childrenIds: [child.id] }),
        expect.objectContaining(body),
      ])
    );
  });

  it('should correctly delete leaf', async () => {
    const root = await createGraphRoot();
    const body: EventInsertDto = {
      ...MOCKED_EVENT_INSERT_BASE,
      parentIds: [MOCKED_ROOT_ID],
    };
    const childResponse = await insertEvent(body);
    // turn off foreign key constraints on sqlite because typeorm cannot apply ON DELETE CASCADE on sqlite (dunno why?)
    // @todo: fix
    const connection = getConnection();
    await connection.query('PRAGMA foreign_keys=OFF;');
    const response = await deleteEvent(childResponse.body.id);
    await connection.query('PRAGMA foreign_keys=ON;');
    expect(response.status).toEqual(200);

    const graphResponse = await readGraph();
    expect(graphResponse.status).toEqual(200);
    expect(graphResponse.body.events).toStrictEqual([
      expect.objectContaining({ ...root, childrenIds: [] }),
    ]);
  });

  it('should correctly delete event and assign new parent to its children', async () => {
    const root = await createGraphRoot();
    const body: EventInsertDto = {
      ...MOCKED_EVENT_INSERT_BASE,
      parentIds: [MOCKED_ROOT_ID],
    };
    const childResponse = await insertEvent(body);
    const childLeaf = { ...MOCKED_EVENT_INSERT_BASE, parentIds: [childResponse.body.id] };
    const firstChildLeafResponse = await insertEvent(childLeaf);
    const secondChildLeafResponse = await insertEvent(childLeaf);
    // turn off foreign key constraints on sqlite because typeorm cannot apply ON DELETE CASCADE on sqlite (dunno why?)
    // @todo: fix
    const connection = getConnection();
    await connection.query('PRAGMA foreign_keys=OFF;');
    const response = await deleteEvent(childResponse.body.id, root.id);
    await connection.query('PRAGMA foreign_keys=ON;');
    expect(response.status).toEqual(200);

    const graphResponse = await readGraph();
    expect(graphResponse.status).toEqual(200);
    expect(graphResponse.body.events).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          ...root,
          childrenIds: [firstChildLeafResponse.body.id, secondChildLeafResponse.body.id],
        }),
        expect.objectContaining({ ...childLeaf, parentIds: [root.id] }),
        expect.objectContaining({ ...childLeaf, parentIds: [root.id] }),
      ])
    );
  });

  it('should correctly update event', async () => {
    const root = await createGraphRoot();
    const children: EventInsertDto = {
      ...MOCKED_EVENT_INSERT_BASE,
      parentIds: [MOCKED_ROOT_ID],
    };
    const childrenResponse = await insertEvent(children);
    const leaf: EventInsertDto = {
      ...MOCKED_EVENT_INSERT_BASE,
      parentIds: [childrenResponse.body.id],
    };
    const leafResponse = await insertEvent(leaf);

    const updateDto: EventUpdateDto = {
      title: leaf.title,
      status: EventStatus.None,
      type: EventType.Normal,
      charactersMetadataArray: [],
      descriptionMetadataArray: [],
      placeMetadataArray: [],
      parentIds: [root.id],
      displayStatus: EventDisplayStatus.Collapsed,
    };
    const response = await updateEvent(leafResponse.body.id, updateDto);
    expect(response.status).toEqual(200);

    const graphResponse = await readGraph();
    expect(graphResponse.status).toEqual(200);
    expect(graphResponse.body.events).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          ...root,
          childrenIds: [childrenResponse.body.id, leafResponse.body.id],
        }),
        expect.objectContaining({ ...response.body, parentIds: [root.id], childrenIds: [] }),
        expect.objectContaining({ ...children, parentIds: [root.id], childrenIds: [] }),
      ])
    );
  });

  it('should throw if trying to set parent of event to itself', async () => {
    const response = await insertEvent(MOCKED_EVENT_INSERT_BASE);
    const badResponse = await updateEvent(response.body.id, { parentIds: [response.body.id] });
    expect(badResponse.status).toEqual(400);
  });
});
