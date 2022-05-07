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
  schemaId: string;
  imageBase64: string;
  metadataArray: MetadataInstance[];
}

export type MetadataInstance = {
  type: string;
  sequenceNumber: number;
  value: string;
  fieldName: string;
};

interface CodexViewState {
  schemas: Schema[];
  downloadedSchemas: string[];
  entries: { [schemaId: string]: Entry[] };
}

const initialState: CodexViewState = {
  schemas: [],
  downloadedSchemas: [],
  entries: {},
};

export const fetchSchemas = createAsyncThunk('codex/fetchSchemas', async (campaignId: string) => {
  const response = await protectedApiClient.get(`api/schema/list?campaignId=${campaignId}`);
  return response;
});

export const fetchEntries = createAsyncThunk('codex/fetchEntries', async (schemaId: string) => {
  const response = await protectedApiClient.get(`api/object/list?schemaId=${schemaId}`);
  return {
    response: response,
    schemaId: schemaId,
  };
});

const codexViewSlice = createSlice({
  name: 'codex',
  initialState,
  reducers: {
    addSchema: (state, action) => {
      state.schemas = state.schemas.concat(action.payload.newSchema);
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
  },
  extraReducers: builder => {
    builder.addCase(fetchSchemas.fulfilled, (state, action) => {
      if (action.payload.status === 200) {
        state.schemas = action.payload.data.schemas;
      }
    });
    builder.addCase(fetchEntries.fulfilled, (state, action) => {
      if (action.payload.response.status === 200) {
        state.downloadedSchemas = state.downloadedSchemas.concat(action.payload.schemaId);
        const newObjectsState = state.entries;
        newObjectsState[action.payload.schemaId] = action.payload.response.data.objects;
        state.entries = newObjectsState;
      }
    });
  },
});

export const { addSchema, addEntry, editEntry } = codexViewSlice.actions;

export default codexViewSlice.reducer;
