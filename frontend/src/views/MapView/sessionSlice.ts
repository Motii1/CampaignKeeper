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

type SessionState = {
  eventsList: SessionEventWithPos[];
  isEventsListDownloaded: boolean;
  currentSessionId: string;
};

const initialState: SessionState = {
  eventsList: [],
  isEventsListDownloaded: false,
  currentSessionId: '',
};

export const fetchEvents = createAsyncThunk('session/fetchEvents', async (sessionId: string) => {
  const response = await protectedApiClient.get(`api/event/graph/${sessionId}`);
  return response;
});

const sessionSlice = createSlice({
  name: 'session',
  initialState,
  reducers: {
    // removeEvent
    // editEvent
    // setCampaignId
    // setSessionId
    // setIds
    setSessionId: (state, action) => {
      state.currentSessionId = action.payload.currentSessionId;
    },
    updateState: (state, action) => {
      state.isEventsListDownloaded = action.payload.isEventsListDownloaded
        ? action.payload.isEventsListDownloaded
        : state.isEventsListDownloaded;
      state.currentSessionId = action.payload.currentSessionId
        ? action.payload.currentSessionId
        : state.currentSessionId;
    },
    addEvent: (state, action) => {
      const currentEventsList = state.eventsList;
      const newEventList = currentEventsList.concat(action.payload.newEvent);
      state.eventsList = newEventList;
    },
  },
  extraReducers: builder => {
    builder.addCase(fetchEvents.fulfilled, (state, action) => {
      if (action.payload.status === 200) {
        state.isEventsListDownloaded = true;
        const eventsFromAPI = action.payload.data.events;
        eventsFromAPI.forEach((event: SessionEventWithPos) => {
          event.x = -1;
          event.y = -1;
        });
        setYPos(eventsFromAPI);
        state.eventsList = eventsFromAPI;
      }
    });
  },
});

export const { addEvent, setSessionId, updateState } = sessionSlice.actions;

export default sessionSlice.reducer;
