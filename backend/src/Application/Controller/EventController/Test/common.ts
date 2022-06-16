import { makeAuthorizedTestRequest } from '../../../../Common/Test/Request';
import { MOCKED_SESSION_ID } from '../../../../Common/Test/Session';
import { EventStatus, EventType, TextFieldType } from '../../../../Domain/Campaign/Event/Event';
import { App } from '../../../App/App';
import { EventDeleteDto } from '../Dto/EventDeleteDto';
import { EventInsertDto } from '../Dto/EventInsertDto';
import { EventController, EventRoutes } from '../EventController';

export const BASE_ENDPOINT = '/api/event';
export const testApp = new App([['/event', new EventController()]]);

export const MOCKED_EVENT_INSERT_BASE: EventInsertDto = {
  title: 'root',
  status: EventStatus.Done,
  charactersMetadataArray: [{ type: TextFieldType.string, value: 'test', sequenceNumber: 0 }],
  placeMetadataArray: [{ type: TextFieldType.string, value: 'test', sequenceNumber: 0 }],
  descriptionMetadataArray: [{ type: TextFieldType.string, value: 'test', sequenceNumber: 0 }],
  type: EventType.Fight,
  parentIds: [],
  sessionId: MOCKED_SESSION_ID,
};
export const MOCKED_ROOT_ID = 1;

export const readGraph = async () =>
  await makeAuthorizedTestRequest(
    testApp,
    `${BASE_ENDPOINT}/${EventRoutes.Graph}/${MOCKED_SESSION_ID}`,
    'get'
  );

export const createGraphRoot = async () => {
  const response = await insertEvent();
  return response.body;
};

export const insertEvent = async (event: EventInsertDto = MOCKED_EVENT_INSERT_BASE) =>
  await makeAuthorizedTestRequest(testApp, BASE_ENDPOINT, 'post').send(event);

export const deleteEvent = async (id: number, newParentId?: number) => {
  const request = makeAuthorizedTestRequest(testApp, `${BASE_ENDPOINT}/${id}`, 'delete');
  if (newParentId) {
    const dto: EventDeleteDto = { parentId: newParentId };
    request.send(dto);
  }
  return await request;
};
