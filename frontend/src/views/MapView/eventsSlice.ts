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

const addEventToStore = (newEvent: SessionEvent, eventsList: SessionEventWithPos[]) =>
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

const removeEventFromStore = (
  deletedEvent: SessionEventWithPos,
  newParentId: string,
  eventsList: SessionEventWithPos[]
) =>
  eventsList.map(event => {
    // add info to new parent for orpahned events
    if (event.id === newParentId)
      return {
        ...event,
        childrenIds: event.childrenIds
          .filter(id => id !== deletedEvent.id)
          .concat(deletedEvent.childrenIds),
      };
    // deleted event was child
    if (event.childrenIds.includes(deletedEvent.id))
      return {
        ...event,
        childrenIds: event.childrenIds.filter(id => id !== deletedEvent.id),
      };
    // deleted event was parent
    if (event.parentIds.includes(deletedEvent.id))
      return {
        ...event,
        parentIds: event.parentIds.filter(id => id !== deletedEvent.id).concat(newParentId),
      };
    // deleted event is not associated
    return event;
  });

const eventsSlice = createSlice({
  name: 'session',
  initialState,
  reducers: {
    addEvent: (state, action) => {
      const currentEventsList = state.eventsList;
      const newEventsList = addEventToStore(action.payload.newEvent, currentEventsList);
      // eslint-disable-next-line no-console
      console.log(newEventsList);
      newEventsList.forEach((event: SessionEventWithPos) => {
        event.x = -1;
        event.y = -1;
      });
      setYPos(newEventsList);
      state.eventsList = newEventsList;
    },
    editEvent: (state, action) => {
      const currentEventsList = state.eventsList.filter(
        event => event.id !== action.payload.updatedEvent.id
      );
      const newEventList = addEventToStore(action.payload.updatedEvent, currentEventsList);
      newEventList.forEach((event: SessionEventWithPos) => {
        event.x = -1;
        event.y = -1;
      });
      setYPos(newEventList);
      state.eventsList = newEventList;
    },
    deleteEvent: (state, action) => {
      const currentEventsList = state.eventsList.filter(
        event => event.id !== action.payload.deletedEvent.id
      );
      const newEventsList = removeEventFromStore(
        action.payload.deletedEvent,
        action.payload.newParent,
        currentEventsList
      );
      // eslint-disable-next-line no-console
      console.log(newEventsList);
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
