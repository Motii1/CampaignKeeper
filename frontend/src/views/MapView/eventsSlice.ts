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

const addEventToEventsList = (newEvent: SessionEvent, eventsList: SessionEventWithPos[]) =>
  eventsList
    .map(event => {
      const newEventId = newEvent.id;
      if (newEvent.parentIds.includes(event.id) && !event.childrenIds.includes(newEventId))
        return {
          ...event,
          childrenIds: event.childrenIds.concat(newEventId),
        };
      else if (newEvent.childrenIds.includes(newEventId) && !event.parentIds.includes(newEventId))
        return {
          ...event,
          parentIds: event.parentIds.concat(newEventId),
        };
      return event;
    })
    .concat({
      ...newEvent,
      x: -1,
      y: -1,
    });

const removeEventFromEventList = (idToRemove: string, eventsList: SessionEventWithPos[]) =>
  eventsList
    .filter(event => event.id !== idToRemove)
    .map(event => ({
      ...event,
      parentsIds: event.parentIds.filter(id => id !== idToRemove),
      childrenIds: event.childrenIds.filter(id => id !== idToRemove),
    }));

const eventsSlice = createSlice({
  name: 'session',
  initialState,
  reducers: {
    addEvent: (state, action) => {
      const currentEventsList = state.eventsList;
      const newEventList = addEventToEventsList(action.payload.newEvent, currentEventsList);
      newEventList.forEach((event: SessionEventWithPos) => {
        event.x = -1;
        event.y = -1;
      });
      setYPos(newEventList);
      state.eventsList = newEventList;
    },
    editEvent: (state, action) => {
      const currentEventsList = state.eventsList.filter(
        event => event.id !== action.payload.updatedEvent.id
      );
      const newEventList = addEventToEventsList(action.payload.updatedEvent, currentEventsList);
      newEventList.forEach((event: SessionEventWithPos) => {
        event.x = -1;
        event.y = -1;
      });
      setYPos(newEventList);
      state.eventsList = newEventList;
    },
    deleteEvent: (state, action) => {
      const currentEventsList = state.eventsList.filter(event => event.id !== action.payload.id);
      const newEventsList = removeEventFromEventList(action.payload.id, currentEventsList);
      newEventsList.forEach((event: SessionEventWithPos) => {
        event.x = -1;
        event.y = -1;
      });
      setYPos(newEventsList);
      state.eventsList = newEventsList;
    },
    hideEvent: (state, action) => {
      const newEventsList = state.eventsList.map(event => {
        if (event.id === action.payload.id)
          return {
            ...event,
            displayStatus: 'hidden',
          };
        return event;
      });
      state.eventsList = newEventsList;
    },
    showEvent: (state, action) => {
      const newEventsList = state.eventsList.map(event => {
        if (event.id === action.payload.id)
          return {
            ...event,
            displayStatus: 'shown',
          };
        return event;
      });
      state.eventsList = newEventsList;
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

export const { addEvent, editEvent, deleteEvent, hideEvent, showEvent, resetState } =
  eventsSlice.actions;

export default eventsSlice.reducer;
