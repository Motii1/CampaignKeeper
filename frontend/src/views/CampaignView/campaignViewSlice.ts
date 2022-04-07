import { createSlice } from '@reduxjs/toolkit';
import { NavBarViewDialog } from '../../types/types';

interface CampaignViewState {
  dialogName: string;
  type: NavBarViewDialog;
  campaignId: number;
  campaignName: string;
  campaignImageBase64: string;
}

const initialState: CampaignViewState = {
  dialogName: '',
  type: NavBarViewDialog.NewCampaign,
  campaignId: -1,
  campaignName: '',
  campaignImageBase64: '',
};

const campaignViewSlice = createSlice({
  name: 'campaignView',
  initialState,
  reducers: {
    updateState: (state, action) => {
      state.dialogName = action.payload.name ? action.payload.name : state.dialogName;
      state.type = action.payload.type ? action.payload.type : state.type;
    },
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    resetState: (state, _action) => {
      state.dialogName = '';
      state.type = NavBarViewDialog.NewCampaign;
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

export const { updateState, resetState, updateSelectedCampaignData, resetSelectedCampaignData } =
  campaignViewSlice.actions;

export default campaignViewSlice.reducer;
