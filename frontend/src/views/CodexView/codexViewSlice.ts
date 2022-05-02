import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import protectedApiClient from '../../axios/axios';

export interface Schema {
  id: string;
  title: string;
  campaignId: string;
  fields: string[];
}

export interface Entry {
  id: string;
  title: string;
  schemaId: number;
  imageBase64: string;
  metadataArray: metadataInstance[];
}

export type metadataInstance = {
  type: string;
  sequenceNumber: number;
  value: string;
  fieldName: string;
};

interface CodexViewState {
  isSchemasListDownloaded: boolean;
  schemas: Schema[];
  downloadedSchemas: string[];
  entries: { [schemaId: string]: Entry[] };
  currentSchema: null | Schema;
  currentEntry: null | Entry;
}

const initialState: CodexViewState = {
  isSchemasListDownloaded: false,
  schemas: [],
  downloadedSchemas: [],
  entries: {},
  currentSchema: null,
  currentEntry: null,
};

export const fetchSchemas = createAsyncThunk(
  'codexView/fetchSchemas',
  async (campaignId: number) => {
    const response = await protectedApiClient.get(`api/schema/list?campaignId=${campaignId}`);
    return response;
  }
);

export const fetchObjects = createAsyncThunk('codexView/fetchObjects', async (schemaId: string) => {
  const response = await protectedApiClient.get(`api/object/list?schemaId=${schemaId}`);
  return response;
});

const codexViewSlice = createSlice({
  name: 'codexView',
  initialState,
  reducers: {
    addSchema: (state, action) => {
      state.schemas = state.schemas.concat(action.payload.newSchema);
    },
    updateCurrentSchema: (state, action) => {
      const newSchema = state.schemas.find(schema => schema.id === action.payload.newSchemaId);
      state.currentSchema = newSchema ? newSchema : null;
    },
    updateCurrentEntry: (state, action) => {
      if (state.currentSchema) {
        const newEntry = state.entries[state.currentSchema.id].find(
          entry => entry.id === action.payload.newEntryId
        );
        state.currentEntry = newEntry ? newEntry : null;
      } else state.currentEntry = null;
    },
  },
  extraReducers: builder => {
    builder.addCase(fetchSchemas.fulfilled, (state, action) => {
      if (action.payload.status === 200) {
        state.isSchemasListDownloaded = true;
        state.schemas = action.payload.data.schemas;
      }
    });
    builder.addCase(fetchObjects.fulfilled, (state, action) => {
      if (action.payload.status === 200 && state.currentSchema) {
        state.downloadedSchemas = state.downloadedSchemas.concat(state.currentSchema.id);
        const newObjectsState = state.entries;
        newObjectsState[state.currentSchema.id] = action.payload.data.objects;
        state.entries = newObjectsState;
      }
    });
  },
});

export const { addSchema, updateCurrentSchema, updateCurrentEntry } = codexViewSlice.actions;

export default codexViewSlice.reducer;