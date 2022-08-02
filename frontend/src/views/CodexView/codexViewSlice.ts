import { createSlice } from '@reduxjs/toolkit';
import { Entry, Schema } from './codexSlice';

interface CodexViewState {
  codexCampaignId: string;
  currentSchema: null | Schema;
  currentEntry: null | Entry;
}

const initialState: CodexViewState = {
  codexCampaignId: '',
  currentSchema: null,
  currentEntry: null,
};

/**
 * Redux slice used to store info about currently selected/displayed
 * schema and entry in CodexView
 */
const codexViewSlice = createSlice({
  name: 'codexView',
  initialState,
  reducers: {
    setCurrentSchema: (state, action) => {
      state.currentSchema = action.payload.newSchema;
      state.currentEntry = null;
    },
    setCurrentEntry: (state, action) => {
      state.currentEntry = action.payload.newEntry;
    },
    setCurrentSchemaAndEntry: (state, action) => {
      state.currentSchema = action.payload.newSchema;
      state.currentEntry = action.payload.newEntry;
    },
    updateCampaignId: (state, action) => {
      state.codexCampaignId = action.payload.campaignId;
    },
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    resetCurrent: (state, _action) => {
      state.currentSchema = null;
      state.currentEntry = null;
    },
  },
});

export const {
  setCurrentSchema,
  setCurrentEntry,
  setCurrentSchemaAndEntry,
  updateCampaignId,
  resetCurrent,
} = codexViewSlice.actions;

export default codexViewSlice.reducer;
