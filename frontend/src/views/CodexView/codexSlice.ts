import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import protectedApiClient from '../../axios/axios';

export type Schema = {
  id: string;
  title: string;
  campaignId: string;
  fields: string[];
};

export type Entry = {
  id: string;
  title: string;
  schemaId: string;
  imageBase64: string;
  metadataArray: CodexMetadataInstance[];
};

export type EntriesHashMap = { [schemaId: string]: Entry[] };

export type CodexMetadataInstance = {
  type: string;
  sequenceNumber: number;
  value: string;
  fieldName: string;
};

interface CodexViewState {
  schemas: Schema[];
  entries: EntriesHashMap;
  isCodexDownloaded: boolean;
}

const initialState: CodexViewState = {
  schemas: [],
  entries: {},
  isCodexDownloaded: false,
};

export const fetchSchemasAndEntries = createAsyncThunk(
  'codex/fetchSchemas',
  async (campaignId: string) => {
    const responseSchemas = await protectedApiClient.get(
      `api/schema/list?campaignId=${campaignId}`
    );
    const responseEntries = await protectedApiClient.get(
      `api/object/list?campaignId=${campaignId}`
    );
    return {
      responseSchemas,
      responseEntries,
    };
  }
);

const codexViewSlice = createSlice({
  name: 'codex',
  initialState,
  reducers: {
    addSchema: (state, action) => {
      state.schemas = state.schemas.concat(action.payload.newSchema);
      const newEntries = state.entries;
      newEntries[action.payload.newSchema.id] = [];
      state.entries = newEntries;
    },
    deleteSchema: (state, action) => {
      const newSchemas = state.schemas.filter(schema => schema.id !== action.payload.schemaId);
      state.schemas = newSchemas;
      const newEntries = state.entries;
      newEntries[action.payload.schemaId] = [];
      state.entries = newEntries;
    },
    addEntry: (state, action) => {
      const newEntries = state.entries;
      newEntries[action.payload.schemaId] = newEntries[action.payload.schemaId].concat(
        action.payload.newEntry
      );
      state.entries = newEntries;
    },
    editEntry: (state, action) => {
      const newEntries = state.entries;
      newEntries[action.payload.schemaId] = newEntries[action.payload.schemaId].filter(
        element => element.id !== action.payload.newEntry.id
      );
      newEntries[action.payload.schemaId] = newEntries[action.payload.schemaId].concat(
        action.payload.newEntry
      );
      state.entries = newEntries;
    },
    deleteEntry: (state, action) => {
      const newEntries = state.entries;
      newEntries[action.payload.schemaId] = newEntries[action.payload.schemaId].filter(
        element => element.id !== action.payload.entryId
      );
      state.entries = newEntries;
    },
  },
  extraReducers: builder => {
    builder.addCase(fetchSchemasAndEntries.fulfilled, (state, action) => {
      if (
        action.payload.responseEntries.status === 200 &&
        action.payload.responseEntries.status === 200
      ) {
        state.schemas = action.payload.responseSchemas.data.schemas;
        const newEntries: { [schemaId: string]: Entry[] } = {};
        state.schemas.forEach(schema => {
          newEntries[schema.id] = [];
        });
        const entriesAsList: Entry[] = action.payload.responseEntries.data.objects;
        entriesAsList.forEach(entry => {
          newEntries[entry.schemaId].push(entry);
        });

        state.entries = newEntries;
        state.isCodexDownloaded = true;
      }
    });
  },
});

export const { addSchema, deleteSchema, addEntry, editEntry, deleteEntry } = codexViewSlice.actions;

export default codexViewSlice.reducer;
