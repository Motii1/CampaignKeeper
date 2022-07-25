import { cleanup, fireEvent, RenderResult, screen, waitFor } from '@testing-library/react';
import { rest } from 'msw';
import { setupServer } from 'msw/node';
import { store } from '../../store';
import { renderWithProviders } from '../../utils/test-utils';
import { CampaignView } from './CampaignView';
import { updateState as updateStateCampaign } from './campaignViewSlice';

type SessionPostBody = {
  name: string;
};

const testSessionList = [
  {
    id: 1,
    name: 'Test Session 1',
    createdAt: '2022-03-10T10:10:50.026Z',
    campaignId: 1,
  },
  {
    id: 2,
    name: 'Test Session 2',
    createdAt: '2022-03-10T10:10:51.026Z',
    campaignId: 1,
  },
];

describe('CampaignView tests', () => {
  let component: RenderResult;

  const server = setupServer(
    rest.get('api/session/list', (_req, res, ctx) => res(ctx.json({ sessions: testSessionList }))),
    rest.post<SessionPostBody>('api/session', (req, res, ctx) =>
      res(
        ctx.json({
          id: 3,
          name: req.body.name,
          createdAt: '',
          campaignId: 1,
        })
      )
    ),
    rest.patch('api/session/1', (_req, res, ctx) => res(ctx.status(200))),
    rest.delete('api/session/2', (_req, res, ctx) => res(ctx.status(200))),
    rest.get('api/schema/list', (_req, res, ctx) => res(ctx.json({ schemas: [] }))),
    rest.get('api/object/list', (_req, res, ctx) => res(ctx.json({ objects: [] })))
  );

  const campaignName = 'Test Campaign';

  beforeAll(() => {
    server.listen();
    // required to provide content for Campaign Tile
    store.dispatch(
      updateStateCampaign({
        campaignId: 1,
        campaignName: campaignName,
      })
    );
  });

  afterAll(() => {
    server.close();
    cleanup();
  });

  beforeEach(() => (component = renderWithProviders(<CampaignView />, { route: '/campaign' })));
  afterEach(() => component.unmount());

  describe('rendering test', () => {
    test('renders CampaignView with some campaigns', async () => {
      expect(screen.getByText(/“.*”/)).toBeInTheDocument();

      await waitFor(() => {
        expect(screen.getByText('Test Session 1')).toBeInTheDocument();
        expect(screen.getByText('Test Session 2')).toBeInTheDocument();
        expect(screen.getByText('New session')).toBeInTheDocument();
      });
    });
  });

  describe('functionalities tests', () => {
    test('opens CampaignDialog in creation mode after click on FAB', async () => {
      await waitFor(() => {
        const fab = screen.getByLabelText('custom-fab');
        expect(fab).toBeInTheDocument();
        fireEvent.click(fab);
        expect(screen.getByText('BACK')).toBeInTheDocument();
        expect(screen.getAllByText(/New session/)[0]).toBeInTheDocument();
        expect(screen.getByText('Name')).toBeInTheDocument();
        expect(screen.getByText('OK')).toBeInTheDocument();
        expect(screen.getByText('CANCEL')).toBeInTheDocument();
      });
    });

    test('opens context menu after right click on SessionTile', async () => {
      await waitFor(() => {
        expect(screen.getByText('Test Session 1')).toBeInTheDocument();
        fireEvent.contextMenu(screen.getByText('Test Session 1'));
        expect(screen.getByText('Edit')).toBeInTheDocument();
      });
    });

    test('opens CampaignDialog in edit mode after click on Edit', async () => {
      await waitFor(() => {
        fireEvent.contextMenu(screen.getByText('Test Session 2'));
      });
      fireEvent.click(screen.getByText('Edit'));
      expect(screen.getByText('BACK')).toBeInTheDocument();
      expect(screen.getByText('Edit session')).toBeInTheDocument();
      expect(screen.getByRole('button', { name: /OK/ })).toBeInTheDocument();
      expect(screen.getByRole('button', { name: /DELETE/ })).toBeInTheDocument();
      expect(screen.getByRole('button', { name: /CANCEL/ })).toBeInTheDocument();
    });

    test('shows dialog asking for confirmation on delete', async () => {
      const sessionNameToDelete = 'Test Session 2';
      await waitFor(() => {
        fireEvent.contextMenu(screen.getByText(sessionNameToDelete));
      });
      fireEvent.click(screen.getByText('Edit'));
      fireEvent.click(screen.getByRole('button', { name: /DELETE/ }));
      expect(screen.getByText('Are you sure?')).toBeInTheDocument();
      expect(screen.getByText("This action can't be undone.")).toBeInTheDocument();
    });
  });

  describe('API operations tests', () => {
    test('creates new session', async () => {
      const newSessionName = 'Test Session New';

      await waitFor(() => {
        expect(screen.getByLabelText('custom-fab')).toBeInTheDocument();
        fireEvent.click(screen.getByLabelText('custom-fab'));
        expect(screen.getByRole('textbox')).toBeInTheDocument();
      });

      fireEvent.change(screen.getByRole('textbox'), { target: { value: newSessionName } });
      fireEvent.click(screen.getByRole('button', { name: /OK/ }));

      await waitFor(() => expect(screen.getByText(newSessionName)).toBeInTheDocument());
    });

    test('edits existing session', async () => {
      const sessionNameToEdit = 'Test Session 1';
      const sessionNameSufix = ' bis';

      await waitFor(() => {
        fireEvent.contextMenu(screen.getByText(sessionNameToEdit));
      });
      fireEvent.click(screen.getByText('Edit'));
      fireEvent.change(screen.getByRole('textbox'), {
        target: { value: `${sessionNameToEdit}${sessionNameSufix}` },
      });
      fireEvent.click(screen.getByRole('button', { name: /OK/ }));

      await waitFor(() =>
        expect(screen.getByText(`${sessionNameToEdit}${sessionNameSufix}`)).toBeInTheDocument()
      );
    });

    test('delets existing session', async () => {
      const sessionNameToDelete = 'Test Session 2';

      await waitFor(() => {
        fireEvent.contextMenu(screen.getByText(sessionNameToDelete));
      });
      fireEvent.click(screen.getByText('Edit'));
      fireEvent.click(screen.getByRole('button', { name: /DELETE/ }));
      fireEvent.click(screen.getByRole('button', { name: /OK/ }));

      await waitFor(() => {
        expect(screen.queryByText(sessionNameToDelete)).toBeNull();
      });
    });
  });
});
