import { cleanup, RenderResult, screen, waitFor } from '@testing-library/react';
import { rest } from 'msw';
import { setupServer } from 'msw/node';
import { store } from '../../store';
import { renderWithProviders } from '../../utils/test-utils';
import { updateState as updateStateCampaign } from '../CampaignView/campaignViewSlice';
import { CodexView } from './CodexView';

const schemasList = [
  {
    id: 1,
    campaignId: 1,
    title: 'test schema 1',
    fields: ['test schema 1 field 1', 'test schema 1 field 2'],
  },
  {
    id: 2,
    campaignId: 1,
    title: 'test schema 2',
    fields: ['test schema 2 field 1', 'test schema 2 field 2', 'test schema 2 field 3'],
  },
];

const objectsList = [
  {
    id: 1,
    schemaId: 1,
    title: 'test entry 1',
    imageBase64: null,
    metadataArray: [
      {
        sequenceNumber: 0,
        value: 'test entry 1 field 1',
        type: 'string',
        fieldName: 'test schema 1 field 1',
      },
      {
        sequenceNumber: 0,
        value: 'test entry 1 field 1',
        type: 'string',
        fieldName: 'test schema 1 field 2',
      },
    ],
  },
  {
    id: 2,
    schemaId: 1,
    title: 'test entry 2',
    imageBase64: null,
    metadataArray: [
      {
        sequenceNumber: 0,
        value: 'test entry 1 field 2',
        type: 'string',
        fieldName: 'test schema 1 field 1',
      },
      {
        sequenceNumber: 0,
        value: 'test entry 1 field 1 ',
        type: 'string',
        fieldName: 'test schema 1 field 2',
      },
      {
        sequenceNumber: 1,
        value: '2006',
        type: 'id',
        fieldName: 'test schema 1 field 2',
      },
    ],
  },
  {
    id: 3,
    schemaId: 2,
    title: 'test entry 3',
    imageBase64: null,
    metadataArray: [
      {
        sequenceNumber: 0,
        value: 'test entry 3 field 1',
        type: 'string',
        fieldName: 'test schema 2 field 1',
      },
      {
        sequenceNumber: 0,
        value: 'test entry 3 field 2',
        type: 'string',
        fieldName: 'test schema 2 field 2',
      },
      {
        sequenceNumber: 0,
        value: 'test entry 3 field 3',
        type: 'string',
        fieldName: 'test schema 2 field 3',
      },
    ],
  },
];

describe('CampaignView tests', () => {
  let component: RenderResult;

  const server = setupServer(
    rest.get('api/schema/list', (_req, res, ctx) => res(ctx.json({ schemas: schemasList }))),
    rest.get('api/object/list', (_req, res, ctx) => res(ctx.json({ objects: objectsList })))
  );

  const campaignName = 'Test Campaign';

  beforeAll(() => {
    server.listen();
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

  beforeEach(() => (component = renderWithProviders(<CodexView />, { route: '/codex' })));
  afterEach(() => component.unmount());

  describe('rendering test', () => {
    test('renders CodexView fixed elements', async () => {
      expect(screen.getByText('New schema')).toBeInTheDocument();
      expect(screen.getByText('Select a schema, ye wise sage')).toBeInTheDocument();
      expect(screen.getByText('SCHEMAS')).toBeInTheDocument();
    });

    test('renders CodexView with elements fetched from API', async () => {
      await waitFor(() => {
        expect(screen.getByText('test schema 1')).toBeInTheDocument();
        expect(screen.getByText('test schema 2')).toBeInTheDocument();
      });
    });
  });
});
