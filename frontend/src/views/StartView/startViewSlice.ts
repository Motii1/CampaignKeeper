import { createSlice } from '@reduxjs/toolkit';
import { NavBarViewDialog } from '../../types/types';

interface StartViewState {
  name: string;
  image: null | File;
  type: NavBarViewDialog;
}

const initialState: StartViewState = {
  name: '',
  image: null,
  type: NavBarViewDialog.New,
};

const startViewSlice = createSlice({
  name: 'startView',
  initialState,
  reducers: {
    updateState: (state, action) => {
      state.name = action.payload.name ? action.payload.name : state.name;
      state.image =
        action.payload.image || action.payload.image === null ? action.payload.image : state.image;
      state.type = action.payload.type ? action.payload.type : state.type;
    },
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    resetState: (state, _action) => {
      state.name = '';
      state.image = null;
      state.type = NavBarViewDialog.New;
    },
  },
});

export const { updateState, resetState } = startViewSlice.actions;

export default startViewSlice.reducer;
