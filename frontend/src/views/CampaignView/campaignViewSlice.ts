import { createSlice } from '@reduxjs/toolkit';
import { NavBarViewDialog } from '../../types/types';

interface CampaignViewState {
  type: NavBarViewDialog;
  campaignId: number;
  campaignName: string;
  campaignImageBase64: string;
  sessionId: number;
  sessionName: string;
}

const initialState: CampaignViewState = {
  type: NavBarViewDialog.NewCampaign,
  campaignId: -1,
  campaignName: '',
  campaignImageBase64: '',
  sessionId: -1,
  sessionName: '',
};

const campaignViewSlice = createSlice({
  name: 'campaignView',
  initialState,
  reducers: {
    updateName: (state, action) => {
      state.sessionName = action.payload.name;
    },
    updateState: (state, action) => {
      state.type = action.payload.type ? action.payload.type : state.type;
      state.campaignId = action.payload.campaignId ? action.payload.campaignId : state.campaignId;
      state.campaignName = action.payload.campaignName
        ? action.payload.campaignName
        : state.campaignName;
      state.campaignImageBase64 = action.payload.campaignImageBase64
        ? action.payload.campaignImageBase64
        : state.campaignImageBase64;
      state.sessionId = action.payload.sessionId ? action.payload.sessionId : state.sessionId;
      state.sessionName = action.payload.sessionName
        ? action.payload.sessionName
        : state.sessionName;
    },
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    resetState: (state, _action) => {
      state.type = NavBarViewDialog.NewCampaign;
      state.sessionId = -1;
      state.sessionName = '';
    },
    updateSelectedCampaignData: (state, action) => {
      state.campaignId = action.payload.campaignId;
      state.campaignName = action.payload.campaignName;
      state.campaignImageBase64 = action.payload.campaignImageBase64;
    },
    // removing data of selected campaign if it was deleted in StartView
    resetSelectedCampaignData: (state, action) => {
      if (state.campaignId === action.payload.campaignId) {
        state.campaignId = -1;
        state.campaignName = '';
        state.campaignImageBase64 = '';
      }
    },
  },
});

export const {
  updateName,
  updateState,
  resetState,
  updateSelectedCampaignData,
  resetSelectedCampaignData,
} = campaignViewSlice.actions;

export default campaignViewSlice.reducer;
