import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import protectedApiClient from '../../axios/axios';

type Session = {
  id: number;
  name: string;
  createdAt: Date;
  campaignId: string;
};

type SessionsState = {
  sessionsList: Session[];
  isSessionsListDownloaded: boolean;
};

const initialState: SessionsState = {
  sessionsList: [],
  isSessionsListDownloaded: false,
};

export const fetchSessions = createAsyncThunk('sessions/fetchSessions', async () => {
  const response = await protectedApiClient.get('api/session/list');
  return response;
});

const sessionsSlice = createSlice({
  name: 'sessions',
  initialState,
  reducers: {
    addSession: (state, action) => {
      state.sessionsList = state.sessionsList.concat(action.payload.newSession);
    },
    editSession: (state, action) => {
      state.sessionsList = state.sessionsList.map(session => {
        if (session.id === action.payload.id) {
          session.name = action.payload.name;
          return session;
        }
        return session;
      });
    },
    deleteSession: (state, action) => {
      state.sessionsList = state.sessionsList.filter(session => session.id !== action.payload.id);
    },
  },
  extraReducers: builder => {
    builder.addCase(fetchSessions.fulfilled, (state, action) => {
      if (action.payload.status === 200) {
        state.isSessionsListDownloaded = true;
        state.sessionsList = action.payload.data.campaigns;
      }
    });
  },
});

export const { addSession, editSession, deleteSession } = sessionsSlice.actions;

export default sessionsSlice.reducer;
