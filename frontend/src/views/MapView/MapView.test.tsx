import { act, cleanup, fireEvent, RenderResult, screen, waitFor } from '@testing-library/react';
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
    id: '1',
    sessionId: SESSION_ID,
    title: 'Event 1',
    placeMetadataArray: [{ value: 'Place event 1', sequenceNumber: 0, type: 'string' }],
    descriptionMetadataArray: [{ value: 'Description event 1', sequenceNumber: 0, type: 'string' }],
    charactersMetadataArray: [{ value: 'Character event 1', sequenceNumber: 0, type: 'string' }],
    status: 'none',
    type: 'normal',
    childrenIds: ['2', '3'],
    parentIds: [],
    displayStatus: 'shown',
  },
  {
    id: '2',
    sessionId: SESSION_ID,
    title: 'Event 2',
    placeMetadataArray: [{ value: 'Place event 2', sequenceNumber: 0, type: 'string' }],
    descriptionMetadataArray: [{ value: 'Description event 2', sequenceNumber: 0, type: 'string' }],
    charactersMetadataArray: [{ value: 'Character event 2', sequenceNumber: 0, type: 'string' }],
    status: 'none',
    type: 'normal',
    childrenIds: ['4', '5'],
    parentIds: ['1'],
    displayStatus: 'shown',
  },
  {
    id: '3',
    sessionId: SESSION_ID,
    title: 'Event 3',
    placeMetadataArray: [],
    descriptionMetadataArray: [],
    charactersMetadataArray: [],
    status: 'none',
    type: 'normal',
    childrenIds: ['5', '6'],
    parentIds: ['1'],
    displayStatus: 'shown',
  },
  {
    id: '4',
    sessionId: SESSION_ID,
    title: 'Event 4',
    placeMetadataArray: [],
    descriptionMetadataArray: [],
    charactersMetadataArray: [],
    status: 'none',
    type: 'normal',
    childrenIds: ['7'],
    parentIds: ['2'],
    displayStatus: 'shown',
  },
  {
    id: '5',
    sessionId: SESSION_ID,
    title: 'Event 5',
    placeMetadataArray: [],
    descriptionMetadataArray: [],
    charactersMetadataArray: [],
    status: 'none',
    type: 'normal',
    childrenIds: [],
    parentIds: ['2', '3'],
    displayStatus: 'shown',
  },
  {
    id: '6',
    sessionId: SESSION_ID,
    title: 'Event 6',
    placeMetadataArray: [],
    descriptionMetadataArray: [],
    charactersMetadataArray: [],
    status: 'none',
    type: 'normal',
    childrenIds: [],
    parentIds: ['3'],
    displayStatus: 'shown',
  },
  {
    id: '7',
    sessionId: SESSION_ID,
    title: 'Event 7',
    placeMetadataArray: [],
    descriptionMetadataArray: [],
    charactersMetadataArray: [],
    status: 'none',
    type: 'normal',
    childrenIds: [],
    parentIds: ['4'],
    displayStatus: 'shown',
  },
];

jest.mock('./components/EventGraph/components/EventWrapper/components/EventArrow/EventArrow.tsx');

describe('MapView tests', () => {
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
    store.dispatch(
      setCurrentSession({ currentSessionId: SESSION_ID, currentSessionTitle: SESSION_NAME })
    );
  });

  afterAll(() => {
    server.close();
    cleanup();
  });

  describe('rendering graph test', () => {
    beforeEach(() => (component = renderWithProviders(<MapView />, { route: '/map' })));
    afterEach(() => component.unmount());

    test('renders graph with event tiles build from data fetched from API', async () => {
      await waitFor(() => {
        eventsList.forEach(event => expect(screen.getByText(event.title)).toBeInTheDocument());
      });
    });

    test('renders graph with root arrows', async () => {
      await waitFor(() => {
        eventsList.forEach(event => {
          if (event.parentIds.length === 0)
            expect(screen.getByText(`root-node-event-${event.id}`)).toBeInTheDocument();
        });
      });
    });

    test('renders graph with children arrows', async () => {
      await waitFor(() => {
        eventsList.forEach(parentEvent => {
          if (parentEvent.childrenIds.length > 0)
            parentEvent.childrenIds.forEach(childEventId =>
              expect(
                screen.getByText(`event-${parentEvent.id}-event-${childEventId}`)
              ).toBeInTheDocument()
            );
        });
      });
    });

    test('renders eventTile', async () => {
      await waitFor(() => {
        const firstEvent = eventsList[0];
        expect(screen.getByText(firstEvent.title)).toBeInTheDocument();
        expect(screen.getAllByText('Place')).toHaveLength(eventsList.length);
        expect(screen.getByText(firstEvent.placeMetadataArray[0].value)).toBeInTheDocument();
        expect(screen.getAllByText('Characters')).toHaveLength(eventsList.length);
        expect(screen.getByText(firstEvent.charactersMetadataArray[0].value)).toBeInTheDocument();
        expect(screen.getAllByText('Description')).toHaveLength(eventsList.length);
        expect(screen.getByText(firstEvent.descriptionMetadataArray[0].value)).toBeInTheDocument();

        expect(screen.getAllByTestId('EditOutlinedIcon')).toHaveLength(eventsList.length);
        expect(screen.getAllByTestId('VisibilityOutlinedIcon')).toHaveLength(eventsList.length);
        expect(screen.getAllByTestId('CheckBoxOutlineBlankOutlinedIcon')).toHaveLength(
          eventsList.length
        );
      });
    });
  });

  describe('eventTile functionalities test', () => {
    beforeEach(() => (component = renderWithProviders(<MapView />, { route: '/map' })));
    afterEach(() => component.unmount());

    test('hides content and descendants of collapsed element', async () => {
      await waitFor(async () => {
        act(() => {
          fireEvent.click(screen.getAllByTestId('VisibilityOutlinedIcon')[1] as HTMLElement);
        });

        const secondEvent = eventsList[1];
        expect(screen.getByText(eventsList[0].title)).toBeInTheDocument();
        expect(screen.getByText(eventsList[1].title)).toBeInTheDocument();
        expect(screen.getByText(eventsList[2].title)).toBeInTheDocument();
        expect(screen.queryByText(eventsList[3].title)).toBeNull();
        expect(screen.getByText(eventsList[4].title)).toBeInTheDocument();
        expect(screen.getByText(eventsList[5].title)).toBeInTheDocument();
        expect(screen.queryByText(eventsList[6].title)).toBeNull();

        expect(screen.getAllByText('Place')).toHaveLength(eventsList.length - 3);
        expect(screen.queryByText(secondEvent.placeMetadataArray[0].value)).toBeNull();
        expect(screen.getAllByText('Characters')).toHaveLength(eventsList.length - 3);
        expect(screen.queryByText(secondEvent.charactersMetadataArray[0].value)).toBeNull();
        expect(screen.getAllByText('Description')).toHaveLength(eventsList.length - 3);
        expect(screen.queryByText(secondEvent.descriptionMetadataArray[0].value)).toBeNull();
      });
    });
  });

  describe('dialog operations test', () => {
    beforeEach(() => (component = renderWithProviders(<MapView />, { route: '/map' })));
    afterEach(() => component.unmount());

    test('opens dialog in New Event mode', async () => {
      await waitFor(async () => {
        fireEvent.click(screen.getByText('New entry'));

        expect(screen.getAllByTestId('AddIcon')).toHaveLength(1 + 4);

        expect(screen.getByTestId('ArrowBackIcon')).toBeInTheDocument();
        expect(screen.getByText('BACK')).toBeInTheDocument();

        expect(screen.getByText('Create new event')).toBeInTheDocument();
        expect(screen.getByText('Title')).toBeInTheDocument();
        expect(screen.getByText('Parents')).toBeInTheDocument();
        expect(
          screen.getByText("Event without parents will be session's starting event")
        ).toBeInTheDocument();
        expect(screen.getByText('Type')).toBeInTheDocument();
        expect(screen.getByText('normal')).toBeInTheDocument();
        expect(screen.getByText('Status')).toBeInTheDocument();
        expect(screen.getByText('none')).toBeInTheDocument();

        expect(screen.getAllByRole('textbox')).toHaveLength(2);

        expect(screen.getByText('OK')).toBeInTheDocument();
        expect(screen.queryByText('DELETE')).toBeNull();
        expect(screen.getByText('CANCEL')).toBeInTheDocument();
      });
    });

    test('opens dialog in Edit Event mode', async () => {
      await waitFor(async () => {
        fireEvent.click(screen.getAllByTestId('EditOutlinedIcon')[0] as HTMLElement);

        expect(screen.getAllByTestId('AddIcon')).toHaveLength(1 + 4);

        expect(screen.getByTestId('ArrowBackIcon')).toBeInTheDocument();
        expect(screen.getByText('BACK')).toBeInTheDocument();

        expect(screen.getByText('Edit event')).toBeInTheDocument();
        expect(screen.getByText('Title')).toBeInTheDocument();
        expect(screen.getByText('Parents')).toBeInTheDocument();
        expect(
          screen.getByText("Event without parents will be session's starting event")
        ).toBeInTheDocument();
        expect(screen.getByText('Type')).toBeInTheDocument();
        expect(screen.getByText(eventsList[0].type)).toBeInTheDocument();
        expect(screen.getByText('Status')).toBeInTheDocument();
        expect(screen.getByText(eventsList[0].status)).toBeInTheDocument();
        expect(screen.getAllByText(eventsList[0].placeMetadataArray[0].value)).toHaveLength(2);
        expect(screen.getAllByText(eventsList[0].charactersMetadataArray[0].value)).toHaveLength(2);
        expect(screen.getAllByText(eventsList[0].descriptionMetadataArray[0].value)).toHaveLength(
          2
        );

        expect(screen.getAllByRole('textbox')).toHaveLength(2);

        expect(screen.getByText('OK')).toBeInTheDocument();
        expect(screen.getByText('DELETE')).toBeInTheDocument();
        expect(screen.getByText('CANCEL')).toBeInTheDocument();
      });
    });

    test('edits event', async () => {
      fireEvent.click(screen.getAllByTestId('EditOutlinedIcon')[0] as HTMLElement);

      const sufix = 'bis';
      const firstEvent = eventsList[0];
      await waitFor(async () => {
        const textBoxes = Array.from(screen.getAllByRole('textbox'));

        fireEvent.change(textBoxes[0], {
          target: { value: firstEvent.title.concat(sufix) },
        });
        fireEvent.click(screen.getAllByTestId('CancelIcon')[0] as HTMLElement);
        fireEvent.change(textBoxes[1], {
          target: { value: firstEvent.descriptionMetadataArray[0].value.concat(sufix) },
        });
        fireEvent.click(screen.getByText('OK'));

        await waitFor(async () => {
          expect(screen.getByText(firstEvent.title.concat(sufix))).toBeInTheDocument();
          expect(screen.queryByTestId(firstEvent.placeMetadataArray[0].value)).toBeNull();
          expect(screen.getByText(firstEvent.charactersMetadataArray[0].value)).toBeInTheDocument();
          expect(
            screen.getByText(firstEvent.descriptionMetadataArray[0].value.concat(sufix))
          ).toBeInTheDocument();
        });
      });
    });

    test('deletes event', async () => {
      fireEvent.click(screen.getAllByTestId('EditOutlinedIcon')[4] as HTMLElement);
      const deletedEvent = screen.getAllByRole('textbox')[0] as HTMLInputElement;
      const deletedEventTitle = deletedEvent.value;
      fireEvent.click(screen.getByText('DELETE'));
      fireEvent.click(screen.getAllByText('OK')[1]);

      await waitFor(async () => {
        expect(screen.queryByText(deletedEventTitle)).toBeNull();
      });
    });
  });
});
