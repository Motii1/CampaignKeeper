import { createSlice } from '@reduxjs/toolkit';
import { View } from '../enums/View';

export const viewsSlice = createSlice({
  name: 'views',
  initialState: {
    value: View.Campaign, //CHANGE TO LANDING AFTER NAVBAR FINISH
  },
  reducers: {
    goToLanding: state => {
      state.value = View.Landing;
    },
    goToStart: state => {
      state.value = View.Start;
    },
    goToCampaign: state => {
      state.value = View.Campaign;
    },
    goToMap: state => {
      state.value = View.Map;
    },
    goToSessions: state => {
      state.value = View.Sessions;
    },
    goToCodex: state => {
      state.value = View.Codex;
    },
    goToNotes: state => {
      state.value = View.Notes;
    },
    goToLogout: state => {
      state.value = View.Logout;
    },
    goToError: state => {
      state.value = View.Error;
    },
  },
});

export const {
  goToLanding,
  goToStart,
  goToCampaign,
  goToMap,
  goToSessions,
  goToCodex,
  goToNotes,
  goToLogout,
  goToError,
} = viewsSlice.actions;

export default viewsSlice.reducer;
