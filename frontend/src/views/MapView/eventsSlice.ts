import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import protectedApiClient from '../../axios/axios';
import { setPositions } from './eventPositionUtils';

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

const editEventInStore = (editedEvent: SessionEventWithPos, eventsList: SessionEventWithPos[]) =>
  eventsList
    .map(event => {
      // edited event was a child (and maybe still is)
      if (event.childrenIds.includes(editedEvent.id))
        return editedEvent.parentIds.includes(event.id)
          ? event
          : {
              ...event,
              childrenIds: event.childrenIds.filter(id => id !== editedEvent.id),
            };
      // edited event was a parent (and maybe still is)
      if (event.parentIds.includes(editedEvent.id))
        return editedEvent.childrenIds.includes(event.id)
          ? event
          : {
              ...event,
              parentIds: event.parentIds.filter(id => id !== editedEvent.id),
            };
      // edited event is a new child
      if (editedEvent.parentIds.includes(event.id))
        return {
          ...event,
          childrenIds: event.childrenIds.concat(editedEvent.id),
        };
      // edited event is a new parent
      if (editedEvent.childrenIds.includes(event.id))
        return {
          ...event,
          parentIds: event.parentIds.concat(editedEvent.id),
        };
      // edited event is not associated
      return event;
    })
    .concat(editedEvent);

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
      newEventsList.forEach((event: SessionEventWithPos) => {
        event.x = -1;
        event.y = -1;
      });
      state.eventsList = setPositions(newEventsList);
    },
    editEvent: (state, action) => {
      const currentEventsList = state.eventsList.filter(
        event => event.id !== action.payload.editedEvent.id
      );
      const newEventList = editEventInStore(action.payload.editedEvent, currentEventsList);
      newEventList.forEach((event: SessionEventWithPos) => {
        event.x = -1;
        event.y = -1;
      });
      state.eventsList = setPositions(newEventList);
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
      newEventsList.forEach((event: SessionEventWithPos) => {
        event.x = -1;
        event.y = -1;
      });
      state.eventsList = setPositions(newEventsList);
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
      state.eventsList = setPositions(newEventsList);
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
      state.eventsList = setPositions(newEventsList);
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
        const eventsWithPositions = setPositions(eventsFromAPI);
        state.eventsList = eventsWithPositions;
        state.isEventsListDownloaded = true;
      }
    });
  },
});

export const { addEvent, editEvent, deleteEvent, hideEvent, showEvent, resetState } =
  eventsSlice.actions;

export default eventsSlice.reducer;
