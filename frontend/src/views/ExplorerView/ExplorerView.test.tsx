import { cleanup, RenderResult, screen, waitFor } from '@testing-library/react';
import { rest } from 'msw';
import { setupServer } from 'msw/node';
import { store } from '../../store';
import { renderWithProviders } from '../../utils/test-utils';
import { updateState as updateStateCampaign } from '../CampaignView/campaignViewSlice';
import { initializeState } from '../MapView/eventsSlice';
import { ExplorerView } from './ExplorerView';
import { setCurrentEvent, setSessionId } from './explorerViewSlice';

const CAMPAIGN_ID = 1;
const CAMPAIGN_NAME = 'Test Campaign';

const SESSION_ID = 1;

const eventsList = [
  {
    id: 1,
    sessionId: SESSION_ID,
    title: 'Event 1',
    placeMetadataArray: [{ value: 'Place event 1', sequenceNumber: 0, type: 'string' }],
    descriptionMetadataArray: [{ value: 'Description event 1', sequenceNumber: 0, type: 'string' }],
    charactersMetadataArray: [{ value: 'Character event 1', sequenceNumber: 0, type: 'string' }],
    status: 'none',
    type: 'normal',
    childrenIds: [2, 3],
    parentIds: [],
    displayStatus: 'shown',
  },
  {
    id: 2,
    sessionId: SESSION_ID,
    title: 'Event 2',
    placeMetadataArray: [{ value: 'Place event 2', sequenceNumber: 0, type: 'string' }],
    descriptionMetadataArray: [{ value: 'Description event 2', sequenceNumber: 0, type: 'string' }],
    charactersMetadataArray: [{ value: 'Character event 2', sequenceNumber: 0, type: 'string' }],
    status: 'none',
    type: 'normal',
    childrenIds: [4, 5],
    parentIds: [1],
    displayStatus: 'shown',
  },
  {
    id: 3,
    sessionId: SESSION_ID,
    title: 'Event 3',
    placeMetadataArray: [],
    descriptionMetadataArray: [],
    charactersMetadataArray: [],
    status: 'none',
    type: 'normal',
    childrenIds: [5, 6],
    parentIds: [1],
    displayStatus: 'shown',
  },
  {
    id: 4,
    sessionId: SESSION_ID,
    title: 'Event 4',
    placeMetadataArray: [],
    descriptionMetadataArray: [],
    charactersMetadataArray: [],
    status: 'none',
    type: 'normal',
    childrenIds: [7],
    parentIds: [2],
    displayStatus: 'shown',
  },
  {
    id: 5,
    sessionId: SESSION_ID,
    title: 'Event 5',
    placeMetadataArray: [],
    descriptionMetadataArray: [],
    charactersMetadataArray: [],
    status: 'none',
    type: 'normal',
    childrenIds: [],
    parentIds: [2, 3],
    displayStatus: 'shown',
  },
  {
    id: 6,
    sessionId: SESSION_ID,
    title: 'Event 6',
    placeMetadataArray: [],
    descriptionMetadataArray: [],
    charactersMetadataArray: [],
    status: 'none',
    type: 'normal',
    childrenIds: [],
    parentIds: [3],
    displayStatus: 'shown',
  },
  {
    id: 7,
    sessionId: SESSION_ID,
    title: 'Event 7',
    placeMetadataArray: [],
    descriptionMetadataArray: [],
    charactersMetadataArray: [],
    status: 'none',
    type: 'normal',
    childrenIds: [],
    parentIds: [4],
    displayStatus: 'shown',
  },
];

describe('ExplorerView tests', () => {
  let component: RenderResult;

  const server = setupServer(
    rest.get('api/event/graph/1', (_req, res, ctx) => res(ctx.json({ events: eventsList }))),
    rest.patch('api/event/1', (_req, res, ctx) => res(ctx.status(200))),
    rest.patch('api/event/2', (_req, res, ctx) => res(ctx.status(200))),
    rest.patch('api/event/3', (_req, res, ctx) => res(ctx.status(200))),
    rest.delete('api/event/6', (_req, res, ctx) => res(ctx.status(200)))
  );

  beforeAll(() => {
    server.listen();
    store.dispatch(
      updateStateCampaign({
        campaignId: CAMPAIGN_ID,
        campaignName: CAMPAIGN_NAME,
      })
    );
    store.dispatch(initializeState({ events: eventsList }));
    store.dispatch(setSessionId({ currentSessionId: SESSION_ID }));
    store.dispatch(setCurrentEvent({ currentEvent: eventsList[1] }));
  });

  afterAll(() => {
    server.close();
    cleanup();
  });

  describe('rendering graph test', () => {
    beforeEach(() => (component = renderWithProviders(<ExplorerView />, { route: '/explorer' })));
    afterEach(() => component.unmount());

    test('renders constant UI elements', async () => {
      await waitFor(() => {
        expect(screen.getByText('Prev event')).toBeInTheDocument();
        expect(screen.getByText('Next event')).toBeInTheDocument();
        expect(screen.getByTestId('ModeEditIcon')).toBeInTheDocument();
        expect(screen.getByText('Edit')).toBeInTheDocument();
      });
    });
  });
});
