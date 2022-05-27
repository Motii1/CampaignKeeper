import { createSlice } from '@reduxjs/toolkit';

interface CampaignViewState {
  currentCampaignId: string;
  currentCampaignName: string;
  currentCampaignImageBase64: string;
  sessionId: string;
  sessionName: string;
}

const initialState: CampaignViewState = {
  currentCampaignId: '',
  currentCampaignName: '',
  currentCampaignImageBase64: '',
  sessionId: '',
  sessionName: '',
};

const campaignViewSlice = createSlice({
  name: 'campaignView',
  initialState,
  reducers: {
    setSessionName: (state, action) => {
      state.sessionName = action.payload.name;
    },
    updateState: (state, action) => {
      state.currentCampaignId = action.payload.campaignId
        ? action.payload.campaignId
        : state.currentCampaignId;
      state.currentCampaignName = action.payload.campaignName
        ? action.payload.campaignName
        : state.currentCampaignName;
      state.currentCampaignImageBase64 = action.payload.campaignImageBase64
        ? action.payload.campaignImageBase64
        : state.currentCampaignImageBase64;
      state.sessionId = action.payload.sessionId ? action.payload.sessionId : state.sessionId;
      state.sessionName = action.payload.sessionName
        ? action.payload.sessionName
        : state.sessionName;
    },
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    resetState: (state, _action) => {
      state.sessionId = '';
      state.sessionName = '';
    },
    updateSelectedCampaignData: (state, action) => {
      state.currentCampaignId = action.payload.campaignId;
      state.currentCampaignName = action.payload.campaignName;
      state.currentCampaignImageBase64 = action.payload.campaignImageBase64;
    },
    // removing data of selected campaign if it was deleted in StartView
    resetSelectedCampaignData: (state, action) => {
      if (state.currentCampaignId === action.payload.campaignId) {
        state.currentCampaignId = '';
        state.currentCampaignName = '';
        state.currentCampaignImageBase64 = '';
      }
    },
  },
});

export const {
  setSessionName,
  updateState,
  resetState,
  updateSelectedCampaignData,
  resetSelectedCampaignData,
} = campaignViewSlice.actions;

export default campaignViewSlice.reducer;
