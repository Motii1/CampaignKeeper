import { createSlice } from '@reduxjs/toolkit';
import { NavBarViewDialog } from '../../types/types';

interface StartViewState {
  id: null | number;
  name: string;
  image: null | File;
  type: NavBarViewDialog;
}

const initialState: StartViewState = {
  id: null,
  name: '',
  image: null,
  type: NavBarViewDialog.NewCampaign,
  // ofc names for campaigns should be kept in another slice
};

const startViewSlice = createSlice({
  name: 'startView',
  initialState,
  reducers: {
    updateState: (state, action) => {
      state.id = action.payload.id ? action.payload.id : state.id;
      state.name = action.payload.name ? action.payload.name : state.name;
      state.image =
        action.payload.image || action.payload.image === null ? action.payload.image : state.image;
      state.type = action.payload.type ? action.payload.type : state.type;
    },
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    resetState: (state, _action) => {
      state.id = null;
      state.name = '';
      state.image = null;
      state.type = NavBarViewDialog.NewCampaign;
    },
  },
});

export const { updateState, resetState } = startViewSlice.actions;

export default startViewSlice.reducer;
