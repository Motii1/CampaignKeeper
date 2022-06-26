import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import protectedApiClient from '../../axios/axios';
import { setYPos } from './graphExperiments';

export type EventFieldMetadata = {
  value: string;
  sequenceNumber: number;
  type: string;
};

export interface SessionEvent {
  id: string;
  title: string;
  sessionId: string;
  type: string;
  status: string;
  displayStatus: string;
  placeMetadataArray: EventFieldMetadata[];
  descriptionMetadataArray: EventFieldMetadata[];
  charactersMetadataArray: EventFieldMetadata[];
  parentIds: string[];
  childrenIds: string[];
}

export interface SessionEventWithPos extends SessionEvent {
  x: number;
  y: number;
}

type EventsState = {
  isEventsListDownloaded: boolean;
  eventsList: SessionEventWithPos[];
};

const initialState: EventsState = {
  isEventsListDownloaded: false,
  eventsList: [],
};

export const fetchEvents = createAsyncThunk('session/fetchEvents', async (sessionId: string) => {
  const response = await protectedApiClient.get(`api/event/graph/${sessionId}`);
  return response;
});

const eventsSlice = createSlice({
  name: 'session',
  initialState,
  reducers: {
    // removeEvent
    // editEvent
    addEvent: (state, action) => {
      const currentEventsList = state.eventsList;
      const newEventList = currentEventsList.concat(action.payload.newEvent);
      newEventList.forEach((event: SessionEventWithPos) => {
        event.x = -1;
        event.y = -1;
      });
      setYPos(newEventList);
      state.eventsList = newEventList;
    },
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    resetState: (state, _action) => {
      state.isEventsListDownloaded = false;
      state.eventsList = [];
    },
  },
  extraReducers: builder => {
    builder.addCase(fetchEvents.fulfilled, (state, action) => {
      if (action.payload.status === 200) {
        const eventsFromAPI = action.payload.data.events;
        eventsFromAPI.forEach((event: SessionEventWithPos) => {
          event.x = -1;
          event.y = -1;
        });
        setYPos(eventsFromAPI);
        state.eventsList = eventsFromAPI;
        state.isEventsListDownloaded = true;
      }
    });
  },
});

export const { addEvent, resetState } = eventsSlice.actions;

export default eventsSlice.reducer;
