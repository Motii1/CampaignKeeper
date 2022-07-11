import { createSlice } from '@reduxjs/toolkit';
import { SessionEventWithPos } from './eventsSlice';

type MapViewState = {
  currentSessionId: string;
  currentEvent: null | SessionEventWithPos;
};

const initialState: MapViewState = {
  currentSessionId: '',
  currentEvent: null,
};

const mapViewSlice = createSlice({
  name: 'mapView',
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

export const { setSessionId, setCurrentEvent, resetState } = mapViewSlice.actions;

export default mapViewSlice.reducer;
