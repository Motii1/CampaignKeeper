import { createSlice } from '@reduxjs/toolkit';

type ExplorerViewSlice = {
  currentSessionId: string;
  currentEventId: string;
};

const initialState: ExplorerViewSlice = {
  currentSessionId: '',
  currentEventId: '',
};

const explorerViewSlice = createSlice({
  name: 'explorerView',
  initialState,
  reducers: {
    setSessionId: (state, action) => {
      state.currentSessionId = action.payload.currentSessionId;
      state.currentEventId = '';
    },
    setCurrentEventId: (state, action) => {
      state.currentEventId = action.payload.currentEventId;
    },
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    resetState: (state, _action) => {
      state.currentSessionId = '';
      state.currentEventId = '';
    },
  },
});

export const { setSessionId, setCurrentEventId, resetState } = explorerViewSlice.actions;

export default explorerViewSlice.reducer;
