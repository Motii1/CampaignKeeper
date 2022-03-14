import { createSlice } from '@reduxjs/toolkit';

interface StartViewState {
  campaignId: null | number;
  campaignName: string;
  campaignImageBase64: null | string;
}

const initialState: StartViewState = {
  campaignId: null,
  campaignName: '',
  campaignImageBase64: null,
};

const startViewSlice = createSlice({
  name: 'startView',
  initialState,
  reducers: {
    updateName: (state, action) => {
      state.campaignName = action.payload.name;
    },
    updateImage: (state, action) => {
      state.campaignImageBase64 = action.payload.imageBase64;
    },
    updateState: (state, action) => {
      state.campaignId = action.payload.id ? action.payload.id : state.campaignId;
      state.campaignName = action.payload.name ? action.payload.name : state.campaignName;
      state.campaignImageBase64 =
        action.payload.imageBase64 || action.payload.imageBase64 === null
          ? action.payload.imageBase64
          : state.campaignImageBase64;
    },
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    resetState: (state, _action) => {
      state.campaignId = null;
      state.campaignName = '';
      state.campaignImageBase64 = null;
    },
  },
});

export const { updateName, updateImage, updateState, resetState } = startViewSlice.actions;

export default startViewSlice.reducer;
