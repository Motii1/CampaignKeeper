import { createSlice } from '@reduxjs/toolkit';

interface StartViewState {
  startCampaignId: null | string;
  startCampaignName: string;
  startCampaignImageBase64: null | string;
}

const initialState: StartViewState = {
  startCampaignId: null,
  startCampaignName: '',
  startCampaignImageBase64: null,
};

/**
 * Redux slice used in StartView to display selected campaign view
 * or create new one in StartDialog
 */
const startViewSlice = createSlice({
  name: 'startView',
  initialState,
  reducers: {
    setCurrentName: (state, action) => {
      state.startCampaignName = action.payload.name;
    },
    setCurrentImage: (state, action) => {
      state.startCampaignImageBase64 = action.payload.imageBase64;
    },
    updateState: (state, action) => {
      state.startCampaignId = action.payload.id ? action.payload.id : state.startCampaignId;
      state.startCampaignName = action.payload.name ? action.payload.name : state.startCampaignName;
      state.startCampaignImageBase64 =
        action.payload.imageBase64 || action.payload.imageBase64 === null
          ? action.payload.imageBase64
          : state.startCampaignImageBase64;
    },
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    resetState: (state, _action) => {
      state.startCampaignId = null;
      state.startCampaignName = '';
      state.startCampaignImageBase64 = null;
    },
  },
});

export const { setCurrentName, setCurrentImage, updateState, resetState } = startViewSlice.actions;

export default startViewSlice.reducer;
