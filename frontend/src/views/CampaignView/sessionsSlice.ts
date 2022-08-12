import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import protectedApiClient from '../../axios/axios';

type Session = {
  id: string;
  name: string;
  createdAt: Date;
  campaignId: string;
};

type SessionsState = {
  sessionsList: Session[];
  isSessionsListDownloaded: boolean;
  sessionsCampaignId: string;
};

const initialState: SessionsState = {
  sessionsList: [],
  isSessionsListDownloaded: false,
  sessionsCampaignId: '',
};

/**
 * Async function responsible for fetching session list
 * belonging to currently selected campaign
 */
export const fetchSessions = createAsyncThunk(
  'sessions/fetchSessions',
  async (campaignId: string) => {
    const response = await protectedApiClient.get(`api/session/list?campaignId=${campaignId}`);
    return response;
  }
);

/**
 * Redux slice used to store and operate on information about sessions
 * belonging to currently selected campaign
 */
const sessionsSlice = createSlice({
  name: 'sessions',
  initialState,
  reducers: {
    updateCampaignId: (state, action) => {
      state.sessionsCampaignId = action.payload.campaignId;
    },
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
        state.sessionsList = action.payload.data.sessions;
        state.isSessionsListDownloaded = true;
      }
    });
  },
});

export const { updateCampaignId, addSession, editSession, deleteSession } = sessionsSlice.actions;

export default sessionsSlice.reducer;
