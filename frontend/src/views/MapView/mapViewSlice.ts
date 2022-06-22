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
  },
});

export const { setSessionId, setCurrentEvent } = mapViewSlice.actions;

export default mapViewSlice.reducer;
