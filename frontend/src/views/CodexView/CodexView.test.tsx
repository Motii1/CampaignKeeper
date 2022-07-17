import { cleanup, fireEvent, RenderResult, screen, waitFor } from '@testing-library/react';
import { rest } from 'msw';
import { setupServer } from 'msw/node';
import { store } from '../../store';
import { renderWithProviders } from '../../utils/test-utils';
import { updateState as updateStateCampaign } from '../CampaignView/campaignViewSlice';
import { CodexView } from './CodexView';

const CAMPAIGN_NAME = 'test campaign';
const CAMPAIGN_ID = 1;
const NEW_SCHEMA_NAME = 'new schema';
const NEW_FIELD_NAME = 'new field';
const NEW_ENTRY_NAME = 'new_entry';
const NEW_ENTRY_FIELDS = ['new entry field 1', 'new entry field 2'];

const schemasList = [
  {
    id: 1,
    campaignId: CAMPAIGN_ID,
    title: 'test schema 1',
    fields: ['test schema 1 field 1', 'test schema 1 field 2'],
  },
  {
    id: 2,
    campaignId: CAMPAIGN_ID,
    title: 'test schema 2',
    fields: ['test schema 2 field 1', 'test schema 2 field 2', 'test schema 2 field 3'],
  },
];

// NOTE: second object on list should containt reference to first object on list (for testing references)
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
        value: 'test entry 1 field 2',
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
        value: '1',
        type: 'id',
        fieldName: 'test schema 1 field 2',
      },
    ],
  },
];

const schemaResponse = {
  id: 4,
  campaignId: CAMPAIGN_ID,
  title: NEW_SCHEMA_NAME,
  fields: [NEW_FIELD_NAME],
};

const entryResponse = {
  id: 4,
  schemaId: 1,
  title: NEW_ENTRY_NAME,
  imageBase64: null,
  metadataArray: [
    {
      sequenceNumber: 0,
      value: NEW_ENTRY_FIELDS[0],
      type: 'string',
      fieldName: schemasList[0].fields[0],
    },
    {
      sequenceNumber: 0,
      value: NEW_ENTRY_FIELDS[1],
      type: 'string',
      fieldName: schemasList[0].fields[1],
    },
  ],
};

type SchemaResponseBody = {
  id: number;
  campaignId: string;
  title: string;
  fields: string[];
};

type EntryResponseBody = {
  id: number;
  schemaId: number;
  title: string;
  imageBase64: null | string;
  metadataArray: { sequenceNumber: number; value: string; type: string; fieldName: string }[];
};

describe('CodexView tests', () => {
  let component: RenderResult;

  const server = setupServer(
    rest.get('api/schema/list', (_req, res, ctx) => res(ctx.json({ schemas: schemasList }))),
    rest.get('api/object/list', (_req, res, ctx) => res(ctx.json({ objects: objectsList }))),
    rest.post<SchemaResponseBody>('api/schema', (_req, res, ctx) => res(ctx.json(schemaResponse))),
    rest.delete('api/schema/2', (_req, res, ctx) => res(ctx.status(200))),
    rest.post<EntryResponseBody>('api/object', (_req, res, ctx) => res(ctx.json(entryResponse))),
    rest.patch('api/object/2', (_req, res, ctx) => res(ctx.status(200))),
    rest.delete('api/object/1', (_req, res, ctx) => res(ctx.status(200)))
  );

  beforeAll(() => {
    server.listen();
    store.dispatch(
      updateStateCampaign({
        campaignId: CAMPAIGN_ID,
        campaignName: CAMPAIGN_NAME,
      })
    );
  });

  afterAll(() => {
    server.close();
    cleanup();
  });

  describe('rendering test', () => {
    beforeEach(() => (component = renderWithProviders(<CodexView />, { route: '/codex' })));
    afterEach(() => component.unmount());

    test('renders CodexView fixed elements', () => {
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

  describe('schema functionalities', () => {
    beforeEach(() => (component = renderWithProviders(<CodexView />, { route: '/codex' })));
    afterEach(() => component.unmount());

    test('opens new schema dialog', () => {
      fireEvent.click(screen.getByText('New schema'));
      expect(screen.getByText('BACK')).toBeInTheDocument();
      expect(screen.getByText('Create schema')).toBeInTheDocument();
      expect(screen.getByText('Title')).toBeInTheDocument();
      expect(screen.getByPlaceholderText('Enter new schema name')).toBeInTheDocument();
      expect(screen.getByText('Fields')).toBeInTheDocument();
      expect(screen.getByText('OK')).toBeInTheDocument();
      expect(screen.getByText('CANCEL')).toBeInTheDocument();
    });

    test('opens add field to schema dialog', () => {
      fireEvent.click(screen.getByText('New schema'));
      fireEvent.click(screen.getAllByTestId('AddIcon')[1]);
      expect(screen.getAllByText('BACK')).toHaveLength(2);
      expect(screen.getByText('Add field')).toBeInTheDocument();
      expect(screen.getByText('Name')).toBeInTheDocument();
      expect(screen.getByPlaceholderText('Enter new field name')).toBeInTheDocument();
      expect(screen.getAllByText('OK')).toHaveLength(2);
      expect(screen.getAllByText('CANCEL')).toHaveLength(2);
    });

    test('adds field to new schema', () => {
      fireEvent.click(screen.getByText('New schema'));
      fireEvent.click(screen.getAllByTestId('AddIcon')[1]);
      // const fieldTextbox = ;
      fireEvent.change(screen.getByPlaceholderText('Enter new field name'), {
        target: { value: NEW_FIELD_NAME },
      });
      fireEvent.click(screen.getAllByText('OK')[1]);
      expect(screen.getByText(NEW_FIELD_NAME.toUpperCase())).toBeInTheDocument();
    });

    test('creates new schema', async () => {
      fireEvent.click(screen.getByText('New schema'));
      fireEvent.change(screen.getByPlaceholderText('Enter new schema name'), {
        target: { value: NEW_SCHEMA_NAME },
      });
      fireEvent.click(screen.getAllByTestId('AddIcon')[1]);
      fireEvent.change(screen.getByPlaceholderText('Enter new field name'), {
        target: { value: NEW_FIELD_NAME },
      });
      fireEvent.click(screen.getAllByText('OK')[1]);
      fireEvent.click(screen.getAllByText('OK')[0]);

      await waitFor(() => expect(screen.getByText(NEW_SCHEMA_NAME)).toBeInTheDocument());
    });

    test('displays delete schema dialog', () => {
      fireEvent.contextMenu(screen.getByText(schemasList[1].title));
      expect(screen.getByText('Delete')).toBeInTheDocument();
      fireEvent.click(screen.getByText('Delete'));

      expect(screen.getByText('Delete schema')).toBeInTheDocument();
      expect(screen.getByText("This action can't be undone.")).toBeInTheDocument();
      expect(screen.getByText('OK')).toBeInTheDocument();
      expect(screen.getByText('CANCEL')).toBeInTheDocument();
    });

    test('deletes schema', async () => {
      fireEvent.contextMenu(screen.getAllByText(schemasList[1].title)[0]);
      expect(screen.getByText('Delete')).toBeInTheDocument();
      fireEvent.click(screen.getByText('Delete'));
      fireEvent.click(screen.getByText('OK'));

      await waitFor(() => {
        expect(screen.queryByText('Delete schema')).toBeNull();
        expect(screen.queryByText("This action can't be undone.")).toBeNull();
        expect(screen.queryByText(schemasList[1].title)).toBeNull();
        expect(screen.getByText(schemasList[0].title)).toBeInTheDocument();
      });
    });

    test('displays objects from schema', () => {
      fireEvent.click(screen.getByText(schemasList[0].title));
      expect(screen.getAllByText(schemasList[0].title)).toHaveLength(2);
      objectsList
        .filter(entry => entry.schemaId === schemasList[0].id)
        .forEach(entry => expect(screen.getByText(entry.title)).toBeInTheDocument());
    });

    test('display add new entry button', () => {
      fireEvent.click(screen.getAllByText(schemasList[0].title)[0]);
      expect(screen.getByText('New entry')).toBeInTheDocument();
      expect(screen.getAllByTestId('AddIcon')).toHaveLength(2);
    });
  });

  describe('search bar functionalities', () => {
    beforeEach(() => (component = renderWithProviders(<CodexView />, { route: '/codex' })));
    afterEach(() => component.unmount());

    const entriesInFirstSchema = objectsList.filter(entry => entry.schemaId === schemasList[0].id);

    test('displays search bar', () => {
      fireEvent.click(screen.getAllByText(schemasList[0].title)[0]);
      expect(screen.getByPlaceholderText('Search')).toBeInTheDocument();
    });

    test('filters after search bar input', () => {
      fireEvent.click(screen.getAllByText(schemasList[0].title)[0]);
      fireEvent.change(screen.getByPlaceholderText('Search'), {
        target: { value: entriesInFirstSchema[0].title },
      });
      expect(screen.getByText(entriesInFirstSchema[0].title)).toBeInTheDocument();
      entriesInFirstSchema
        .slice(1)
        .forEach(entry => expect(screen.queryByText(entry.title)).toBeNull());
    });
  });

  describe('entries functionalities', () => {
    beforeEach(() => (component = renderWithProviders(<CodexView />, { route: '/codex' })));
    afterEach(() => component.unmount());

    const entriesInFirstSchema = objectsList.filter(entry => entry.schemaId === schemasList[0].id);

    test('displays entry details', () => {
      const firstEntry = entriesInFirstSchema[0];
      const firstSchema = schemasList[0];
      fireEvent.click(screen.getAllByText(firstSchema.title)[0]);
      fireEvent.click(screen.getByText(firstEntry.title));

      expect(screen.getByText(firstEntry.title)).toBeInTheDocument();
      firstSchema.fields.forEach(field => expect(screen.getByText(field)).toBeInTheDocument());
      firstEntry.metadataArray.forEach(entryMetadata =>
        expect(screen.getByText(entryMetadata.value)).toBeInTheDocument()
      );
    });

    test('displays reference between entries', () => {
      const firstEntry = entriesInFirstSchema[0];
      const secondEntry = entriesInFirstSchema[1];
      const firstSchema = schemasList[0];
      fireEvent.click(screen.getAllByText(firstSchema.title)[0]);
      fireEvent.click(screen.getByText(secondEntry.title));

      expect(screen.getByText(firstEntry.title)).toBeInTheDocument();
    });

    test('displays referenced entry after click on reference', () => {
      const firstEntry = entriesInFirstSchema[0];
      const secondEntry = entriesInFirstSchema[1];
      const firstSchema = schemasList[0];
      fireEvent.click(screen.getAllByText(firstSchema.title)[0]);
      fireEvent.click(screen.getByText(secondEntry.title));
      fireEvent.click(screen.getByText(firstEntry.title));

      expect(screen.getByText(firstEntry.title)).toBeInTheDocument();
      firstSchema.fields.forEach(field => expect(screen.getByText(field)).toBeInTheDocument());
      firstEntry.metadataArray.forEach(entryMetadata =>
        expect(screen.getByText(entryMetadata.value)).toBeInTheDocument()
      );
    });

    test('displays new entry dialog', () => {
      const firstSchema = schemasList[0];
      fireEvent.click(screen.getAllByText(firstSchema.title)[0]);
      fireEvent.click(screen.getByText('New entry'));

      expect(screen.getByTestId('ArrowBackIcon')).toBeInTheDocument();
      expect(screen.getByText('BACK')).toBeInTheDocument();
      expect(screen.getByText('Create new entry')).toBeInTheDocument();
      expect(screen.getByText('Title')).toBeInTheDocument();
      firstSchema.fields.forEach(field => expect(screen.getByText(field)).toBeInTheDocument());
      expect(screen.getAllByRole('textbox')).toHaveLength(1 + firstSchema.fields.length);
      expect(screen.getAllByTestId('AddIcon')).toHaveLength(2 + 1 + firstSchema.fields.length);
    });

    test('creates new entry', async () => {
      const firstSchema = schemasList[0];
      fireEvent.click(screen.getAllByText(firstSchema.title)[0]);
      fireEvent.click(screen.getByText('New entry'));

      const textBoxes = Array.from(screen.getAllByRole('textbox'));
      fireEvent.change(textBoxes[0], {
        target: { value: NEW_ENTRY_NAME },
      });
      fireEvent.change(textBoxes[1], {
        target: { value: NEW_ENTRY_FIELDS[0] },
      });
      fireEvent.change(textBoxes[2], {
        target: { value: NEW_ENTRY_FIELDS[1] },
      });
      fireEvent.click(screen.getByText('OK'));

      await waitFor(() => {
        expect(screen.getByText(entryResponse.title)).toBeInTheDocument();
        fireEvent.click(screen.getByText(entryResponse.title));
        expect(screen.getByText(entryResponse.title)).toBeInTheDocument();
        firstSchema.fields.forEach(field => expect(screen.getByText(field)).toBeInTheDocument());
        entryResponse.metadataArray.forEach(entryMetadata =>
          expect(screen.getByText(entryMetadata.value)).toBeInTheDocument()
        );
      });
    });

    test('displays delete exisiting entry dialog', () => {
      const firstSchema = schemasList[0];
      const firstEntry = objectsList[0];

      fireEvent.click(screen.getByText(firstSchema.title));
      fireEvent.click(screen.getByText(firstEntry.title));
      fireEvent.click(screen.getByText('Edit entry'));
      fireEvent.click(screen.getByText('DELETE'));

      expect(screen.getAllByTestId('ArrowBackIcon')).toHaveLength(3);
      expect(screen.getAllByText('BACK')).toHaveLength(3);
      expect(screen.getByText('Are you sure?')).toBeInTheDocument();
      expect(screen.getByText("This action can't be undone.")).toBeInTheDocument();
      expect(screen.getAllByText('CANCEL')).toHaveLength(2);
      expect(screen.getAllByText('OK')).toHaveLength(2);
    });

    test('deletes exisiting entry', async () => {
      const firstSchema = schemasList[0];
      const firstEntry = objectsList[0];

      fireEvent.click(screen.getByText(firstSchema.title));
      fireEvent.click(screen.getByText(firstEntry.title));
      fireEvent.click(screen.getByText('Edit entry'));
      fireEvent.click(screen.getByText('DELETE'));
      fireEvent.click(screen.getAllByText('OK')[1]);

      await waitFor(() => {
        expect(screen.queryByText('Are you sure?')).toBeNull();
        expect(screen.queryByText('OK')).toBeNull();
        expect(screen.queryByText('CANCEL')).toBeNull();
        expect(screen.queryByText('DELETE')).toBeNull();

        expect(screen.queryByText(firstEntry.title)).toBeNull();
        objectsList
          .filter(entry => entry.schemaId === firstSchema.id)
          .slice(1)
          .forEach(entry => expect(screen.getByText(entry.title)).toBeInTheDocument());
      });
    });

    test('displays edit entry dialog', () => {
      const firstSchema = schemasList[0];
      const secondEntry = objectsList[1];
      fireEvent.click(screen.getAllByText(firstSchema.title)[0]);
      fireEvent.click(screen.getByText(secondEntry.title));
      fireEvent.click(screen.getByText('Edit entry'));

      expect(screen.getAllByTestId('ArrowBackIcon')).toHaveLength(2);
      expect(screen.getAllByText('BACK')).toHaveLength(2);
      expect(screen.getByText(`Edit ${firstSchema.title} entry`)).toBeInTheDocument();
      expect(screen.getByText('Title')).toBeInTheDocument();
      firstSchema.fields.forEach(field => expect(screen.getAllByText(field)).toHaveLength(2));
      expect(screen.getAllByRole('textbox')).toHaveLength(1 + firstSchema.fields.length);
      expect(screen.getAllByTestId('AddIcon')).toHaveLength(1 + 1 + firstSchema.fields.length);
      expect(screen.getByText('DELETE')).toBeInTheDocument();
    });

    test('edits exisiting entry', async () => {
      const firstSchema = schemasList[0];
      const secondEntry = objectsList[1];
      const sufix = 'bis';
      fireEvent.click(screen.getAllByText(firstSchema.title)[0]);
      fireEvent.click(screen.getByText(secondEntry.title));
      fireEvent.click(screen.getByText('Edit entry'));

      const textBoxes = Array.from(screen.getAllByRole('textbox'));
      fireEvent.change(textBoxes[0], {
        target: { value: `${secondEntry.title}${sufix}` },
      });
      fireEvent.change(textBoxes[1], {
        target: { value: `${secondEntry.metadataArray[0].value}${sufix}` },
      });
      fireEvent.click(screen.getByText('OK'));

      await waitFor(() => {
        expect(screen.getByText(`${secondEntry.title}${sufix}`)).toBeInTheDocument();
        firstSchema.fields.forEach(field => expect(screen.getByText(field)).toBeInTheDocument());
        expect(
          screen.getByText(`${secondEntry.metadataArray[0].value}${sufix}`)
        ).toBeInTheDocument();
      });
    });
  });
});
