import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import protectedApiClient from '../../axios/axios';

interface Schema {
  id: string;
  title: string;
  fields: string[];
  deletable: boolean;
}

interface CustomObject {
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
  objects: CustomObject[];
  currentSchemaId: string;
  currentObjectId: string;
}

const initialState: CodexViewState = {
  isSchemasListDownloaded: false,
  schemas: [],
  objects: [],
  currentSchemaId: '-1',
  currentObjectId: '-1',
};

export const fetchSchemas = createAsyncThunk(
  'codexView/fetchSchemas',
  async (campaignId: number) => {
    const response = await protectedApiClient.get(`api/schema/list?campaignId=${campaignId}`);
    return response;
  }
);

const codexViewSlice = createSlice({
  name: 'codexView',
  initialState,
  reducers: {
    addSchema: (state, action) => {
      state.schemas = state.schemas.concat(action.payload.newSchema);
    },
  },
  extraReducers: builder => {
    builder.addCase(fetchSchemas.fulfilled, (state, action) => {
      if (action.payload.status === 200) {
        state.isSchemasListDownloaded = true;
        state.schemas = action.payload.data.schemas;
      }
    });
  },
});

export const { addSchema } = codexViewSlice.actions;

export default codexViewSlice.reducer;
