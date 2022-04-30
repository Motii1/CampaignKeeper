import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import protectedApiClient from '../../axios/axios';

export interface Schema {
  id: string;
  title: string;
  fields: string[];
  deletable: boolean;
}

export interface CustomObject {
  id: string;
  title: string;
  fields: [
    {
      type: undefined;
      value: string;
    }
  ];
}

interface CodexViewState {
  isSchemasListDownloaded: boolean;
  schemas: Schema[];
  downloadedSchemas: string[];
  objects: { [id: string]: CustomObject[] };
  currentSchemaId: null | string;
  currentObjectId: null | string;
}

const initialState: CodexViewState = {
  isSchemasListDownloaded: false,
  schemas: [],
  downloadedSchemas: [],
  objects: {},
  currentSchemaId: null,
  currentObjectId: null,
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
    updateCurrentSchemaId: (state, action) => {
      state.currentSchemaId = action.payload.currentSchemaId;
    },
    updateCurrentObjectId: (state, action) => {
      state.currentObjectId = action.payload.currentObjectId;
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
      if (action.payload.status === 200 && state.currentSchemaId) {
        state.downloadedSchemas = state.downloadedSchemas.concat(state.currentSchemaId);
        const newObjectsState = state.objects;
        newObjectsState[state.currentSchemaId] = action.payload.data.objects;
        state.objects = newObjectsState;
      }
    });
  },
});

export const { addSchema, updateCurrentSchemaId } = codexViewSlice.actions;

export default codexViewSlice.reducer;
