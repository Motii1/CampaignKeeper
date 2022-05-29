import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import protectedApiClient from '../../axios/axios';

type SessionEventFieldMetadata = {
  value: string;
  sequenceNumber: number;
  type: string;
};

type SessionEvent = {
  id: number;
  title: string;
  sessionId: string;
  type: string;
  status: string;
  placeMetadataArray: SessionEventFieldMetadata[];
  descriptionMetadataArray: SessionEventFieldMetadata[];
  charactersMetadataArray: SessionEventFieldMetadata[];
  parentIds: string[];
  childrenIds: string[];
};

type SessionState = {
  eventsList: SessionEvent[];
  isEventsListDownloaded: boolean;
  currentSessionId: string;
};

const initialState: SessionState = {
  eventsList: [],
  isEventsListDownloaded: false,
  currentSessionId: '',
};

export const fetchEvents = createAsyncThunk('session/fetchEvents', async (sessionId: string) => {
  const response = await protectedApiClient.get(`api/graph/${sessionId}`);
  return response;
});

const sessionSlice = createSlice({
  name: 'session',
  initialState,
  reducers: {
    // addEvent
    // removeEvent
    // editEvent
    // setCampaignId
    // setSessionId
    // setIds
    updateState: (state, action) => {
      state.isEventsListDownloaded = action.payload.isEventsListDownloaded
        ? action.payload.isEventsListDownloaded
        : state.isEventsListDownloaded;
      state.currentSessionId = action.payload.currentSessionId
        ? action.payload.currentSessionId
        : state.currentSessionId;
    },
  },
  extraReducers: builder => {
    builder.addCase(fetchEvents.fulfilled, (state, action) => {
      if (action.payload.status === 200) {
        state.isEventsListDownloaded = true;
        state.eventsList = action.payload.data.events;
      }
    });
  },
});

export const { updateState } = sessionSlice.actions;

export default sessionSlice.reducer;
