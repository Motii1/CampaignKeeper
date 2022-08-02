import { createSlice } from '@reduxjs/toolkit';
import { SessionEventWithPos } from '../MapView/eventsSlice';

type ExplorerViewSlice = {
  currentSessionId: string;
  currentEvent: null | SessionEventWithPos;
};

const initialState: ExplorerViewSlice = {
  currentSessionId: '',
  currentEvent: null,
};

/**
 * Redux slice used to store data about session and event currently displayed/selected
 * in CodexView
 */
const explorerViewSlice = createSlice({
  name: 'explorerView',
  initialState,
  reducers: {
    setSessionId: (state, action) => {
      state.currentSessionId = action.payload.currentSessionId;
      state.currentEvent = null;
    },
    setCurrentEvent: (state, action) => {
      state.currentEvent = action.payload.currentEvent;
    },
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    resetState: (state, _action) => {
      state.currentSessionId = '';
      state.currentEvent = null;
    },
  },
});

export const { setSessionId, setCurrentEvent, resetState } = explorerViewSlice.actions;

export default explorerViewSlice.reducer;
