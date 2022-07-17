import { cleanup, RenderResult, screen, waitFor } from '@testing-library/react';
import { rest } from 'msw';
import { setupServer } from 'msw/node';
import { store } from '../../store';
import { renderWithProviders } from '../../utils/test-utils';
import { updateState as updateStateCampaign } from '../CampaignView/campaignViewSlice';
import { MapView } from './MapView';
import { setCurrentSession } from './mapViewSlice';

const CAMPAIGN_ID = 1;
const CAMPAIGN_NAME = 'Test Campaign';

const SESSION_ID = 1;
const SESSION_NAME = 'Test Session';

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

jest.mock('./components/EventGraph/components/EventWrapper/components/EventArrow/EventArrow.tsx');

describe('MapView tests', () => {
  let component: RenderResult;

  // jest.mock('./components/EventGraph/components/EventWrapper/components/EventArrow/EventArrow.tsx');
  // jest.mock(
  //   '/home/pstasiuk/uni/CampaignKeeper/frontend/src/views/MapView/components/EventGraph/components/EventWrapper/components/EventArrow/EventArrow'
  // );

  const server = setupServer(
    rest.get('api/event/graph/1', (_req, res, ctx) => res(ctx.json({ events: eventsList })))
  );

  beforeAll(() => {
    server.listen();
    store.dispatch(
      updateStateCampaign({
        campaignId: CAMPAIGN_ID,
        campaignName: CAMPAIGN_NAME,
      })
    );
    store.dispatch(
      setCurrentSession({ currentSessionId: SESSION_ID, currentSessionTitle: SESSION_NAME })
    );
  });

  afterAll(() => {
    server.close();
    cleanup();
  });

  describe('rendering test', () => {
    beforeEach(() => (component = renderWithProviders(<MapView />, { route: '/map' })));
    afterEach(() => component.unmount());

    test('renders MapView fixed elements', async () => {
      expect(screen.getByText('New entry')).toBeInTheDocument();
      await waitFor(() => expect(screen.getByText(SESSION_NAME)).toBeInTheDocument());
    });

    test('renders MapView with graph build from events fetched from API', async () => {
      await waitFor(() => {
        expect(screen.getByText('Event 1')).toBeInTheDocument();
        expect(screen.getByText('Event 2')).toBeInTheDocument();
        expect(screen.getByText('Event 3')).toBeInTheDocument();
        expect(screen.getByText('Event 4')).toBeInTheDocument();
        expect(screen.getByText('Event 5')).toBeInTheDocument();
        expect(screen.getByText('Event 6')).toBeInTheDocument();
        expect(screen.getByText('Event 7')).toBeInTheDocument();
      });
    });
  });
});
