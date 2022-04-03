import { cleanup, fireEvent, screen, waitFor } from '@testing-library/react';
import { rest } from 'msw';
import { setupServer } from 'msw/node';
import { renderWithProviders } from '../../utils/test-utils';
import { StartView } from './StartView';

type CampaignPostBody = {
  name: string;
  imageBase64: string;
};

const server = setupServer(
  rest.get('api/campaign/list', (_req, res, ctx) => res(ctx.json({ campaigns: testCampaignList }))),
  rest.post<CampaignPostBody>('api/campaign', (req, res, ctx) =>
    res(
      ctx.json({
        id: 3,
        name: req.body.name,
        createdAt: '',
        imageBase64: '',
      })
    )
  ),
  rest.patch('api/campaign/1', (_req, res, ctx) => res(ctx.status(200))),
  rest.delete('api/campaign/2', (_req, res, ctx) => res(ctx.status(200)))
);

const testCampaignList = [
  {
    id: 1,
    name: 'Test Campaign 1',
    createdAt: '2022-03-10T10:10:50.026Z',
    imageBase64: '',
  },
  {
    id: 2,
    name: 'Test Campaign 2',
    createdAt: '2022-03-10T10:10:51.026Z',
    imageBase64: '',
  },
];

beforeAll(() => server.listen());

afterAll(() => {
  server.close();
  cleanup();
});

test('renders StartView with some campaigns', async () => {
  const component = renderWithProviders(<StartView />);
  expect(screen.getByText(/“.*”/)).toBeInTheDocument();

  await waitFor(() => {
    expect(screen.getByText('Test Campaign 1')).toBeInTheDocument();
    expect(screen.getByText('Test Campaign 2')).toBeInTheDocument();
    expect(screen.getByText('New campaign')).toBeInTheDocument();
  });
  component.unmount();
});

test('opens StartDialog in creation mode after click on FAB', async () => {
  const component = renderWithProviders(<StartView />);

  await waitFor(() => {
    const fab = screen.getByLabelText('custom-fab');
    expect(fab).toBeInTheDocument();
    fireEvent.click(fab);
    expect(screen.getByText('BACK')).toBeInTheDocument();
    expect(screen.getAllByText(/New campaign/)[1]).toBeInTheDocument();
    expect(screen.getByText('NAME')).toBeInTheDocument();
    expect(screen.getByText('OK')).toBeInTheDocument();
    expect(screen.getByText('CANCEL')).toBeInTheDocument();
  });
  component.unmount();
});

test('creates new campaign', async () => {
  const component = renderWithProviders(<StartView />);
  const newCampaignName = 'Test Campaign New';

  await waitFor(() => {
    expect(screen.getByLabelText('custom-fab')).toBeInTheDocument();
    fireEvent.click(screen.getByLabelText('custom-fab'));
    expect(screen.getByRole('textbox')).toBeInTheDocument();
  });

  fireEvent.change(screen.getByRole('textbox'), { target: { value: newCampaignName } });
  fireEvent.click(screen.getByRole('button', { name: /OK/ }));

  await waitFor(() => expect(screen.getByText('Test Campaign New')).toBeInTheDocument());

  component.unmount();
});

test('opens context menu after right click on CampaignTile', async () => {
  const component = renderWithProviders(<StartView />);

  await waitFor(() => {
    expect(screen.getByText('Test Campaign 1')).toBeInTheDocument();
    fireEvent.contextMenu(screen.getByText('Test Campaign 1'));
    expect(screen.getByText('Edit')).toBeInTheDocument();
  });
  component.unmount();
});

test('opens StartDialog in edit mode after click on Edit', async () => {
  const component = renderWithProviders(<StartView />);

  await waitFor(() => {
    fireEvent.contextMenu(screen.getByText('Test Campaign 2'));
  });
  fireEvent.click(screen.getByText('Edit'));
  expect(screen.getByText('BACK')).toBeInTheDocument();
  expect(screen.getByText('Edit campaign')).toBeInTheDocument();
  expect(screen.getByRole('button', { name: /OK/ })).toBeInTheDocument();
  expect(screen.getByRole('button', { name: /DELETE/ })).toBeInTheDocument();
  expect(screen.getByRole('button', { name: /CANCEL/ })).toBeInTheDocument();

  component.unmount();
});

test('edits existing campaign', async () => {
  const component = renderWithProviders(<StartView />);
  const campaignNameToEdit = 'Test Campaign 1';
  const campaignNameSufix = ' bis';

  await waitFor(() => {
    fireEvent.contextMenu(screen.getByText(campaignNameToEdit));
  });
  fireEvent.click(screen.getByText('Edit'));
  fireEvent.change(screen.getByRole('textbox'), {
    target: { value: `${campaignNameToEdit}${campaignNameSufix}` },
  });
  fireEvent.click(screen.getByRole('button', { name: /OK/ }));

  await waitFor(() =>
    expect(screen.getByText(`${campaignNameToEdit}${campaignNameSufix}`)).toBeInTheDocument()
  );

  component.unmount();
});

test('shows dialog asking for confirmation on delete', async () => {
  const component = renderWithProviders(<StartView />);
  const campaignNameToDelete = 'Test Campaign 2';

  await waitFor(() => {
    fireEvent.contextMenu(screen.getByText(campaignNameToDelete));
  });
  fireEvent.click(screen.getByText('Edit'));
  fireEvent.click(screen.getByRole('button', { name: /DELETE/ }));
  expect(screen.getByText('Are you sure?')).toBeInTheDocument();
  expect(screen.getByText("This action can't be undone.")).toBeInTheDocument();

  component.unmount();
});

test('delets existing campaign', async () => {
  const component = renderWithProviders(<StartView />);
  const campaignNameToDelete = 'Test Campaign 2';

  await waitFor(() => {
    fireEvent.contextMenu(screen.getByText(campaignNameToDelete));
  });
  fireEvent.click(screen.getByText('Edit'));
  fireEvent.click(screen.getByRole('button', { name: /DELETE/ }));
  fireEvent.click(screen.getByRole('button', { name: /OK/ }));

  await waitFor(() => {
    expect(screen.queryByText(campaignNameToDelete)).toBeNull();
  });

  component.unmount();
});
