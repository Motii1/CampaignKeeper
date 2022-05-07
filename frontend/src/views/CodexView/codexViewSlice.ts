import { createSlice } from '@reduxjs/toolkit';
import { Entry, Schema } from './codexSlice';

interface CodexViewState {
  currentSchema: null | Schema;
  currentEntry: null | Entry;
}

const initialState: CodexViewState = {
  currentSchema: null,
  currentEntry: null,
};

const codexViewSlice = createSlice({
  name: 'codexView',
  initialState,
  reducers: {
    setCurrentSchema: (state, action) => {
      state.currentSchema = action.payload.newSchema;
    },
    setCurrentEntry: (state, action) => {
      state.currentSchema = action.payload.newEntry;
    },
  },
});

export const { setCurrentSchema, setCurrentEntry } = codexViewSlice.actions;

export default codexViewSlice.reducer;
