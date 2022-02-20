import { createSlice } from '@reduxjs/toolkit';
import { NavBarViewDialog } from '../../types/types';

interface CampaignViewState {
  name: string;
  type: NavBarViewDialog;
}

const initialState: CampaignViewState = {
  name: '',
  type: NavBarViewDialog.NewCampaign,
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
      // eslint-disable-next-line no-console
      console.log(state.name, state.type);
    },
  },
});

export const { updateState, resetState } = campaignViewSlice.actions;

export default campaignViewSlice.reducer;
