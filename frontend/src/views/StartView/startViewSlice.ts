import { createSlice } from '@reduxjs/toolkit';

interface StartViewState {
  id: null | number;
  name: string;
  imageBase64: null | string;
}

const initialState: StartViewState = {
  id: null,
  name: '',
  imageBase64: null,
};

const startViewSlice = createSlice({
  name: 'startView',
  initialState,
  reducers: {
    updateName: (state, action) => {
      state.name = action.payload.name;
    },
    updateImage: (state, action) => {
      state.imageBase64 = action.payload.imageBase64;
    },
    updateState: (state, action) => {
      state.id = action.payload.id ? action.payload.id : state.id;
      state.name = action.payload.name ? action.payload.name : state.name;
      state.imageBase64 =
        action.payload.imageBase64 || action.payload.imageBase64 === null
          ? action.payload.imageBase64
          : state.imageBase64;
    },
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    resetState: (state, _action) => {
      state.id = null;
      state.name = '';
      state.imageBase64 = null;
    },
  },
});

export const { updateName, updateImage, updateState, resetState } = startViewSlice.actions;

export default startViewSlice.reducer;
