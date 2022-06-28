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

const getParentStatuses = (currentEvent: SessionEventWithPos, eventsList: SessionEventWithPos[]) =>
  eventsList
    .filter(event => currentEvent.parentIds.includes(event.id))
    .map(event => event.displayStatus);

const collapseAndHideEvents = (
  parentEvent: SessionEventWithPos,
  otherEventsList: SessionEventWithPos[]
) => {
  const eventsToCheck = parentEvent.childrenIds.map(id => id);
  const eventsToHide: string[] = [];
  while (eventsToCheck.length > 0) {
    const currentId = eventsToCheck.shift();
    const currentEvent = otherEventsList.find(event => event.id === currentId);
    // TO-DO: this algorithm is absolutely wrong and needs to be rewritten
    if (currentEvent) {
      const isOnlyOneParentShown =
        getParentStatuses(currentEvent, otherEventsList).find(status => status === 'shown')
          ?.length === 0;
      if (!isOnlyOneParentShown) {
        eventsToHide.push(currentEvent.id);
        eventsToCheck.push(...currentEvent.childrenIds);
        // eslint-disable-next-line no-console
        console.log(eventsToCheck);
      }
    }
  }
  // eslint-disable-next-line no-console
  console.log(eventsToHide);
  return otherEventsList
    .map(event => {
      if (eventsToHide.includes(event.id))
        return {
          ...event,
          displayStatus: 'hidden',
        };
      return event;
    })
    .concat({
      ...parentEvent,
      displayStatus: 'collapsed',
    });
};

const uncollapseAndShowEvents = (
  parentEvent: SessionEventWithPos,
  otherEventsList: SessionEventWithPos[]
) => {
  const eventsToCheck = parentEvent.childrenIds.map(id => id);
  const eventsToShow: string[] = [];
  while (eventsToCheck.length > 0) {
    const currentId = eventsToCheck.shift();
    const currentEvent = otherEventsList.find(event => event.id === currentId);
    if (currentEvent)
      if (currentEvent.displayStatus === 'hidden') {
        eventsToShow.push(currentEvent.id);
        eventsToCheck.push(...currentEvent.childrenIds);
      }
  }
  return otherEventsList
    .map(event => {
      if (eventsToShow.includes(event.id))
        return {
          ...event,
          displayStatus: 'shown',
        };
      return event;
    })
    .concat({
      ...parentEvent,
      displayStatus: 'shown',
    });
};

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
    collapseEvent: (state, action) => {
      const currentEventsList = state.eventsList.filter(
        event => event.id !== action.payload.eventToCollapse.id
      );
      const newEventsList = collapseAndHideEvents(
        action.payload.eventToCollapse,
        currentEventsList
      );
      state.eventsList = newEventsList;
    },
    uncollapseEvent: (state, action) => {
      const currentEventsList = state.eventsList.filter(
        event => event.id !== action.payload.eventToUncollapse.id
      );
      const newEventsList = uncollapseAndShowEvents(
        action.payload.eventToUncollapse,
        currentEventsList
      );
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

export const { addEvent, editEvent, deleteEvent, collapseEvent, uncollapseEvent, resetState } =
  eventsSlice.actions;

export default eventsSlice.reducer;
