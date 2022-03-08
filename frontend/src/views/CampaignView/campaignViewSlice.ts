import { createSlice } from '@reduxjs/toolkit';
import { NavBarViewDialog } from '../../types/types';

interface CampaignViewState {
  name: string;
  type: NavBarViewDialog;
  sessionsNames: Array<string>;
}

const initialState: CampaignViewState = {
  name: '',
  type: NavBarViewDialog.NewCampaign,
  sessionsNames: [
    'Session 1',
    'Session 2',
    'Session 3',
    'Session 4',
    'Session 5',
    'Session 6',
    'Session 7',
    'Session 8',
    'Session 9',
    'Session 10',
    'Session 11',
    'Session 12',
    'Session 13',
    'Session 14',
  ],
};

const campaignViewSlice = createSlice({
  name: 'campaignView',
  initialState,
  reducers: {
    updateState: (state, action) => {
      state.name = action.payload.name ? action.payload.name : state.name;
      state.type = action.payload.type ? action.payload.type : state.type;
    },
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    resetState: (state, _action) => {
      state.name = '';
      state.type = NavBarViewDialog.NewCampaign;
    },
    // TO-DO: delete after API integration
    addSession: (state, action) => {
      state.sessionsNames.push(action.payload.sessionName);
    },
    // TO-DO: delete after API integration
    removeSession: (state, action) => {
      state.sessionsNames = state.sessionsNames.filter(name => name !== action.payload.sessionName);
    },
  },
});

export const { updateState, resetState, addSession, removeSession } = campaignViewSlice.actions;

export default campaignViewSlice.reducer;
