import { cleanup, fireEvent, RenderResult, screen, waitFor } from '@testing-library/react';
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

const NEW_EVENT_TITLE = 'Event 777';
const NEW_EVENT_DESCRIPTION = 'Event 777 description';

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

const newEvent = {
  id: '777',
  sessionId: '1',
  title: 'Event 777',
  placeMetadataArray: [],
  descriptionMetadataArray: [{ value: 'Event 777 description', sequenceNumber: 0, type: 'string' }],
  charactersMetadataArray: [],
  status: 'none',
  type: 'normal',
  childrenIds: [],
  parentIds: ['2'],
  displayStatus: 'shown',
};

const currentEvent = eventsList[1];

describe('ExplorerView tests', () => {
  let component: RenderResult;

  const server = setupServer(
    rest.get('api/event/graph/1', (_req, res, ctx) => res(ctx.json({ events: eventsList }))),
    rest.patch('api/event/2', (_req, res, ctx) => res(ctx.status(200))),
    rest.post('/api/event', (_req, res, ctx) => res(ctx.json(newEvent)))
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
    store.dispatch(setCurrentEvent({ currentEvent: currentEvent }));
  });

  afterAll(() => {
    server.close();
    cleanup();
  });

  describe('rendering components test', () => {
    beforeEach(() => (component = renderWithProviders(<ExplorerView />, { route: '/explorer' })));
    afterEach(() => component.unmount());

    test('renders constant UI elements', async () => {
      await waitFor(() => {
        expect(screen.getByText('Prev event')).toBeInTheDocument();
        expect(screen.getByText('Next event')).toBeInTheDocument();
        expect(screen.getByTestId('AddIcon')).toBeInTheDocument();
        expect(screen.getByText('New event')).toBeInTheDocument();
        expect(screen.getByTestId('ModeEditIcon')).toBeInTheDocument();
        expect(screen.getByText('Edit')).toBeInTheDocument();
      });
    });

    test('renders EventTile without icons', async () => {
      await waitFor(() => {
        expect(screen.getByText(currentEvent.title)).toBeInTheDocument();
        expect(screen.getByText('Place')).toBeInTheDocument();
        expect(screen.getByText(currentEvent.placeMetadataArray[0].value)).toBeInTheDocument();
        expect(screen.getByText('Characters')).toBeInTheDocument();
        expect(screen.getByText(currentEvent.charactersMetadataArray[0].value)).toBeInTheDocument();
        expect(screen.getByText('Description')).toBeInTheDocument();
        expect(
          screen.getByText(currentEvent.descriptionMetadataArray[0].value)
        ).toBeInTheDocument();

        expect(screen.queryByTestId('EditOutlinedIcon')).toBeNull();
        expect(screen.queryByTestId('VisibilityOutlinedIcon')).toBeNull();
        expect(screen.queryByTestId('CheckBoxOutlineBlankOutlinedIcon')).toBeNull();
      });
    });

    test('renders children', async () => {
      await waitFor(() => {
        const childrenTitles = eventsList
          .filter(event => currentEvent.childrenIds.includes(event.id))
          .map(event => event.title);
        childrenTitles.forEach(title => expect(screen.getByText(title)).toBeInTheDocument());
      });
    });
  });

  describe('opens dialogs with parents/children', () => {
    beforeEach(() => (component = renderWithProviders(<ExplorerView />, { route: '/explorer' })));
    afterEach(() => component.unmount());

    test('opens dialog with parents', async () => {
      await waitFor(() => {
        fireEvent.click(screen.getByText('Prev event'));

        expect(screen.getByText('Choose previous event')).toBeInTheDocument();
        expect(screen.getByTestId('ArrowBackIcon')).toBeInTheDocument();
        expect(screen.getByText('BACK')).toBeInTheDocument();

        const parentEvents = eventsList.filter(event => currentEvent.parentIds.includes(event.id));
        parentEvents.forEach(event => {
          expect(screen.getByText(event.title)).toBeInTheDocument();
          if (event.placeMetadataArray.length > 0)
            expect(screen.getByText(event.placeMetadataArray[0].value)).toBeInTheDocument();
          if (event.charactersMetadataArray.length > 0)
            expect(screen.getByText(event.charactersMetadataArray[0].value)).toBeInTheDocument();
          if (event.descriptionMetadataArray.length > 0)
            expect(screen.getByText(event.descriptionMetadataArray[0].value)).toBeInTheDocument();
        });

        expect(screen.getAllByText('Place')).toHaveLength(1 + parentEvents.length);
        expect(screen.getAllByText('Characters')).toHaveLength(1 + parentEvents.length);
        expect(screen.getAllByText('Description')).toHaveLength(1 + parentEvents.length);

        expect(screen.queryByTestId('EditOutlinedIcon')).toBeNull();
        expect(screen.queryByTestId('VisibilityOutlinedIcon')).toBeNull();
        expect(screen.queryByTestId('CheckBoxOutlineBlankOutlinedIcon')).toBeNull();
      });
    });

    test('opens dialog with children', async () => {
      await waitFor(async () => {
        fireEvent.click(screen.getByText('Next event'));

        expect(screen.getByText('Choose next event')).toBeInTheDocument();
        expect(screen.getByTestId('ArrowBackIcon')).toBeInTheDocument();
        expect(screen.getByText('BACK')).toBeInTheDocument();

        const childrenEvents = eventsList.filter(event =>
          currentEvent.childrenIds.includes(event.id)
        );
        childrenEvents.forEach(event => {
          expect(screen.getAllByText(event.title)).toHaveLength(2);
          if (event.placeMetadataArray.length > 0)
            expect(screen.getByText(event.placeMetadataArray[0].value)).toBeInTheDocument();
          if (event.charactersMetadataArray.length > 0)
            expect(screen.getByText(event.charactersMetadataArray[0].value)).toBeInTheDocument();
          if (event.descriptionMetadataArray.length > 0)
            expect(screen.getByText(event.descriptionMetadataArray[0].value)).toBeInTheDocument();
        });

        expect(screen.getAllByText('Place')).toHaveLength(1 + childrenEvents.length);
        expect(screen.getAllByText('Characters')).toHaveLength(1 + childrenEvents.length);
        expect(screen.getAllByText('Description')).toHaveLength(1 + childrenEvents.length);

        expect(screen.queryByTestId('EditOutlinedIcon')).toBeNull();
        expect(screen.queryByTestId('VisibilityOutlinedIcon')).toBeNull();
        expect(screen.queryByTestId('CheckBoxOutlineBlankOutlinedIcon')).toBeNull();
      });
    });
  });

  describe('dialog operations tests', () => {
    beforeEach(() => (component = renderWithProviders(<ExplorerView />, { route: '/explorer' })));
    afterEach(() => component.unmount());

    test('opens dialog in edit mode', async () => {
      await waitFor(() => {
        fireEvent.click(screen.getByText('Edit'));

        const parentsTitles = eventsList
          .filter(event => currentEvent.parentIds.includes(event.id))
          .map(event => event.title);

        expect(screen.getAllByTestId('AddIcon')).toHaveLength(1 + 4);

        expect(screen.getByTestId('ArrowBackIcon')).toBeInTheDocument();
        expect(screen.getByText('BACK')).toBeInTheDocument();

        expect(screen.getByText('Edit event')).toBeInTheDocument();
        expect(screen.getByText('Title')).toBeInTheDocument();
        expect(screen.getByText('Parents')).toBeInTheDocument();
        parentsTitles.forEach(title => expect(screen.getByText(title)).toBeInTheDocument());
        expect(screen.getByText('Type')).toBeInTheDocument();
        expect(screen.getByText(currentEvent.type)).toBeInTheDocument();
        expect(screen.getByText('Status')).toBeInTheDocument();
        expect(screen.getByText(currentEvent.status)).toBeInTheDocument();
        expect(screen.getAllByText(currentEvent.placeMetadataArray[0].value)).toHaveLength(2);
        expect(screen.getAllByText(currentEvent.charactersMetadataArray[0].value)).toHaveLength(2);
        expect(screen.getAllByText(currentEvent.descriptionMetadataArray[0].value)).toHaveLength(2);

        expect(screen.getByText('OK')).toBeInTheDocument();
        expect(screen.getByText('DELETE')).toBeInTheDocument();
        expect(screen.getByText('CANCEL')).toBeInTheDocument();
      });
    });

    test('edits current event', async () => {
      fireEvent.click(screen.getByText('Edit'));

      const sufix = 'bis';
      const textBoxes = Array.from(screen.getAllByRole('textbox'));
      fireEvent.change(textBoxes[0], {
        target: { value: currentEvent.title.concat(sufix) },
      });
      fireEvent.change(textBoxes[1], {
        target: { value: currentEvent.descriptionMetadataArray[0].value.concat(sufix) },
      });
      fireEvent.click(screen.getByText('OK'));

      await waitFor(async () => {
        expect(screen.getByText(currentEvent.title.concat(sufix))).toBeInTheDocument();
        expect(screen.queryByTestId(currentEvent.placeMetadataArray[0].value)).toBeNull();
        expect(screen.getByText(currentEvent.charactersMetadataArray[0].value)).toBeInTheDocument();
        expect(
          screen.getByText(currentEvent.descriptionMetadataArray[0].value.concat(sufix))
        ).toBeInTheDocument();
      });
    });

    test('opens dialog for creating new child', async () => {
      await waitFor(() => {
        fireEvent.click(screen.getByText('New event'));

        expect(screen.getAllByTestId('AddIcon')).toHaveLength(1 + 4);

        expect(screen.getByTestId('ArrowBackIcon')).toBeInTheDocument();
        expect(screen.getByText('BACK')).toBeInTheDocument();

        expect(screen.getByText('Create new event')).toBeInTheDocument();
        expect(screen.getByText('Title')).toBeInTheDocument();
        expect(screen.getByText('Parents')).toBeInTheDocument();
        expect(screen.getByText('Type')).toBeInTheDocument();
        expect(screen.getByText('Status')).toBeInTheDocument();

        expect(screen.getAllByRole('textbox')).toHaveLength(2);

        expect(screen.getByText('OK')).toBeInTheDocument();
        expect(screen.queryByText('DELETE')).toBeNull();
        expect(screen.getByText('CANCEL')).toBeInTheDocument();
      });
    });

    test('creates new child', async () => {
      fireEvent.click(screen.getByText('New event'));
      await waitFor(async () => {
        const textBoxes = Array.from(screen.getAllByRole('textbox'));
        fireEvent.change(textBoxes[0], {
          target: { value: NEW_EVENT_TITLE },
        });
        fireEvent.click(screen.getAllByTestId('CancelIcon')[0] as HTMLElement);
        fireEvent.change(textBoxes[1], {
          target: { value: NEW_EVENT_DESCRIPTION },
        });
        fireEvent.click(screen.getByText('OK'));

        await waitFor(() => {
          expect(screen.getByText(NEW_EVENT_TITLE)).toBeInTheDocument();
        });
      });
    });
  });
});
