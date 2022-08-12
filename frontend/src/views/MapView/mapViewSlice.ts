import { createSlice } from '@reduxjs/toolkit';
import { SessionEventWithPos } from './eventsSlice';

type MapViewState = {
  currentSessionId: string;
  currentSessionTitle: string;
  currentEvent: null | SessionEventWithPos;
};

const initialState: MapViewState = {
  currentSessionId: '',
  currentSessionTitle: '',
  currentEvent: null,
};

/**
 * Redux slice used to store data about session and event
 * currently displayed/selected in MapView
 */
const mapViewSlice = createSlice({
  name: 'mapView',
  initialState,
  reducers: {
    setCurrentSession: (state, action) => {
      state.currentSessionId = action.payload.currentSessionId;
      state.currentSessionTitle = action.payload.currentSessionTitle;
      state.currentEvent = null;
    },
    setCurrentEvent: (state, action) => {
      state.currentEvent = action.payload.currentEvent;
    },
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    resetState: (state, _action) => {
      state.currentSessionId = '';
      state.currentSessionTitle = '';
      state.currentEvent = null;
    },
  },
});

export const { setCurrentSession, setCurrentEvent, resetState } = mapViewSlice.actions;

export default mapViewSlice.reducer;
